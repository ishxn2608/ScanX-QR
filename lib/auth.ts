import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { createUser, getUser, isAdminEmail } from "./firestore";

// HARDCODED ADMIN CREDENTIALS - Only this email can access admin panel
const ADMIN_EMAIL = "Ishanacharya@gmail.com";
const ADMIN_PASSWORD = "SecureQR@2026";

// Store confirmation result for OTP verification
let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifierInstance: RecaptchaVerifier | null = null;

// Initialize reCAPTCHA
export function initRecaptcha(elementId: string): RecaptchaVerifier {
  // Clear existing verifier if any
  if (recaptchaVerifierInstance) {
    try {
      recaptchaVerifierInstance.clear();
    } catch (e) {
      console.log("Error clearing recaptcha:", e);
    }
  }

  recaptchaVerifierInstance = new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved
    },
    "expired-callback": () => {
      // Response expired
      console.log("reCAPTCHA expired");
    },
  });

  return recaptchaVerifierInstance;
}

// Send OTP to phone number
export async function sendOTP(phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<void> {
  try {
    // Format phone number with country code if not present
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    
    // Clear the verifier on error
    if (recaptchaVerifierInstance) {
      try {
        recaptchaVerifierInstance.clear();
        recaptchaVerifierInstance = null;
      } catch (e) {
        console.log("Error clearing verifier:", e);
      }
    }
    
    throw new Error(error.message || "Failed to send OTP");
  }
}

// Verify OTP
export async function verifyOTP(code: string): Promise<boolean> {
  try {
    if (!confirmationResult) {
      throw new Error("No OTP request found. Please request OTP first.");
    }
    await confirmationResult.confirm(code);
    return true;
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    throw new Error("Invalid OTP. Please try again.");
  }
}

// Register user with OTP verification
export async function registerUser(
  email: string,
  password: string,
  name: string,
  mobileNumber: string,
  role: "vendor" | "customer"
) {
  // Prevent admin registration
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    throw new Error("This email is reserved for admin use only");
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await createUser(cred.user.uid, email, name, mobileNumber, role);
    return cred.user;
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.message || "Failed to register");
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (error: any) {
    console.error("Login error:", error.code, error.message);
    // Map Firebase error codes to clean user-facing messages
    switch (error.code) {
      case "auth/wrong-password":
      case "auth/invalid-credential":
        throw new Error("Incorrect password. Please try again.");
      case "auth/user-not-found":
        throw new Error("No account found with this email address.");
      case "auth/invalid-email":
        throw new Error("Please enter a valid email address.");
      case "auth/user-disabled":
        throw new Error("This account has been disabled. Contact support.");
      case "auth/too-many-requests":
        throw new Error("Too many failed attempts. Please try again later.");
      case "auth/network-request-failed":
        throw new Error("Network error. Check your internet connection.");
      default:
        throw new Error("Login failed. Please check your credentials.");
    }
  }
}

// Admin login - separate function for clarity
export async function loginAdmin(email: string, password: string) {
  if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    throw new Error("Invalid admin credentials");
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (cred.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      await signOut(auth);
      throw new Error("Unauthorized access");
    }
    return cred.user;
  } catch (error: any) {
    console.error("Admin login error:", error.code, error.message);
    switch (error.code) {
      case "auth/wrong-password":
      case "auth/invalid-credential":
        throw new Error("Incorrect password. Please try again.");
      case "auth/user-not-found":
        throw new Error("Admin account not found in Firebase. Please create it first.");
      case "auth/too-many-requests":
        throw new Error("Too many failed attempts. Please try again later.");
      case "auth/network-request-failed":
        throw new Error("Network error. Check your internet connection.");
      default:
        throw new Error(error.message || "Invalid admin credentials");
    }
  }
}

// Check if user is admin
export async function isAdmin(uid: string): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;
  return user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Logout user
export async function logoutUser() {
  await signOut(auth);
}

// Get user role
export async function getUserRole(uid: string): Promise<string | null> {
  // Check if admin first
  const user = auth.currentUser;
  if (user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return "admin";
  }

  const data = await getUser(uid);
  return data?.role ?? null;
}

// Get user status
export async function getUserStatus(uid: string): Promise<string | null> {
  const data = await getUser(uid);
  return data?.status ?? null;
}

// Auth state observer
export function onAuthChange(cb: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, cb);
}

// Send password reset email
export async function sendPasswordReset(email: string): Promise<void> {
  // Block admin email from self-service reset
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    throw new Error("Admin password cannot be reset from here.");
  }
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    switch (error.code) {
      case "auth/user-not-found":
        throw new Error("No account found with this email address.");
      case "auth/invalid-email":
        throw new Error("Please enter a valid email address.");
      case "auth/too-many-requests":
        throw new Error("Too many requests. Please try again later.");
      case "auth/network-request-failed":
        throw new Error("Network error. Check your internet connection.");
      default:
        throw new Error("Failed to send reset email. Please try again.");
    }
  }
}

// Export admin credentials for initial setup
export const ADMIN_CREDENTIALS = {
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};
