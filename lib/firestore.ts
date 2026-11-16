import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { Shop, UserData, Transaction } from "./types";
import { v4 as uuidv4 } from "uuid";

const ADMIN_EMAIL = "Ishanacharya@gmail.com";

// Lazy initialization flag
let isInitialized = false;

// Initialize Firebase only when needed
async function ensureFirebaseInit() {
  if (!isInitialized) {
    // Small delay to ensure Firebase is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    isInitialized = true;
  }
}

// Helper: sort by createdAt descending in JS (avoids composite index requirement)
function sortByCreatedAt<T extends { createdAt?: any }>(items: T[]): T[] {
  return items.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

// Helper: sort transactions by timestamp descending
function sortByTimestamp<T extends { timestamp?: any }>(items: T[]): T[] {
  return items.sort((a, b) => {
    const aTime = a.timestamp?.toMillis?.() ?? 0;
    const bTime = b.timestamp?.toMillis?.() ?? 0;
    return bTime - aTime;
  });
}

// Check if email is admin
export function isAdminEmail(email: string): boolean {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

// Create user with mobile verification
export async function createUser(
  uid: string,
  email: string,
  name: string,
  mobileNumber: string,
  role: "vendor" | "customer"
) {
  await ensureFirebaseInit();
  const status = role === "vendor" ? "pending" : "approved";

  await setDoc(doc(db, "users", uid), {
    email,
    name,
    mobileNumber,
    role,
    status,
    createdAt: Timestamp.now(),
    approvedAt: role === "customer" ? Timestamp.now() : null,
    rejectedAt: null,
  });
}

// Get user data
export async function getUser(uid: string): Promise<UserData | null> {
  await ensureFirebaseInit();
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as UserData;
}

// Update user status (admin only)
export async function updateUserStatus(
  uid: string,
  status: "approved" | "rejected"
): Promise<void> {
  const updateData: any = { status };

  if (status === "approved") {
    updateData.approvedAt = Timestamp.now();
    updateData.rejectedAt = null;
  } else {
    updateData.rejectedAt = Timestamp.now();
    updateData.approvedAt = null;
  }

  await updateDoc(doc(db, "users", uid), updateData);
}

// Get all pending vendors (admin only) — no orderBy to avoid index requirement
export async function getPendingVendors(): Promise<UserData[]> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "vendor"),
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  const vendors = snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserData));
  return sortByCreatedAt(vendors);
}

// Get all vendors by status (admin only) — no orderBy
export async function getVendorsByStatus(
  status: "pending" | "approved" | "rejected"
): Promise<UserData[]> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "vendor"),
    where("status", "==", status)
  );
  const snap = await getDocs(q);
  const vendors = snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserData));
  return sortByCreatedAt(vendors);
}

// Get all vendors (admin only) — no orderBy
export async function getAllVendors(): Promise<UserData[]> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "vendor")
  );
  const snap = await getDocs(q);
  const vendors = snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserData));
  return sortByCreatedAt(vendors);
}

// Real-time listener for all vendors — no orderBy (sort in JS)
export function onVendorsChange(callback: (vendors: UserData[]) => void) {
  console.log("🔍 Setting up vendors listener...");
  
  const q = query(
    collection(db, "users"),
    where("role", "==", "vendor")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      console.log("📊 Vendors snapshot received:", {
        size: snapshot.size,
        empty: snapshot.empty,
        docs: snapshot.docs.length
      });
      
      const vendors = snapshot.docs.map((d) => {
        const data = d.data();
        console.log("👤 Vendor found:", {
          id: d.id,
          name: data.name,
          email: data.email,
          role: data.role,
          status: data.status
        });
        return { id: d.id, ...data } as UserData;
      });
      
      console.log("✅ Total vendors to display:", vendors.length);
      callback(sortByCreatedAt(vendors));
    },
    (error) => {
      console.error("❌ Vendors listener error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
    }
  );
}

// Real-time listener for pending vendors — no orderBy
export function onPendingVendorsChange(callback: (vendors: UserData[]) => void) {
  const q = query(
    collection(db, "users"),
    where("role", "==", "vendor"),
    where("status", "==", "pending")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const vendors = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as UserData));
      callback(sortByCreatedAt(vendors));
    },
    (error) => {
      console.error("Pending vendors listener error:", error);
    }
  );
}

// Create shop (only for approved vendors)
export async function createShop(
  ownerId: string,
  shopName: string,
  upiId: string,
  imageUrl: string
) {
  await ensureFirebaseInit();
  
  // Check if vendor is approved
  const vendor = await getUser(ownerId);
  if (!vendor || vendor.role !== "vendor" || vendor.status !== "approved") {
    throw new Error("Only approved vendors can create shops");
  }

  const token = uuidv4();
  const shopRef = doc(collection(db, "shops"));
  await setDoc(shopRef, {
    shopName,
    upiId,
    token,
    verified: false,
    imageUrl,
    ownerId,
    createdAt: Timestamp.now(),
    enabled: true,
    verifiedAt: null,
    lastTokenRefresh: null,
  });
  return { id: shopRef.id, token };
}

// Update shop
export async function updateShop(
  shopId: string,
  data: Partial<Pick<Shop, "shopName" | "upiId" | "imageUrl">>
) {
  await updateDoc(doc(db, "shops", shopId), data);
}

// Get shop by token
export async function getShopByToken(token: string): Promise<Shop | null> {
  const snap = await getDocs(
    query(collection(db, "shops"), where("token", "==", token))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Shop;
}

// Get shops by owner — no orderBy
export async function getShopsByOwner(ownerId: string): Promise<Shop[]> {
  const snap = await getDocs(
    query(collection(db, "shops"), where("ownerId", "==", ownerId))
  );
  const shops = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Shop));
  return sortByCreatedAt(shops);
}

// Get all shops (admin only)
export async function getAllShops(): Promise<Shop[]> {
  console.log("🏪 Loading all shops...");
  const snap = await getDocs(collection(db, "shops"));
  console.log("📊 Shops found:", snap.size);
  const shops = snap.docs.map((d) => {
    const data = d.data();
    console.log("🏪 Shop:", {
      id: d.id,
      name: data.shopName,
      verified: data.verified,
      ownerId: data.ownerId
    });
    return { id: d.id, ...data } as Shop;
  });
  return sortByCreatedAt(shops);
}

// Real-time listener for all shops (admin only)
export function onShopsChange(callback: (shops: Shop[]) => void) {
  console.log("🔍 Setting up shops listener...");
  
  return onSnapshot(
    collection(db, "shops"),
    (snapshot) => {
      console.log("📊 Shops snapshot received:", {
        size: snapshot.size,
        empty: snapshot.empty,
        docs: snapshot.docs.length
      });
      
      const shops = snapshot.docs.map((d) => {
        const data = d.data();
        console.log("🏪 Shop found:", {
          id: d.id,
          name: data.shopName,
          verified: data.verified,
          ownerId: data.ownerId
        });
        return { id: d.id, ...data } as Shop;
      });
      
      console.log("✅ Total shops to display:", shops.length);
      callback(sortByCreatedAt(shops));
    },
    (error) => {
      console.error("❌ Shops listener error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
    }
  );
}

// Update shop verification (admin only)
export async function updateShopVerification(shopId: string, verified: boolean) {
  await updateDoc(doc(db, "shops", shopId), {
    verified,
    verifiedAt: verified ? Timestamp.now() : null,
  });
}

// Regenerate token
export async function regenerateToken(shopId: string): Promise<string> {
  const newToken = uuidv4();
  await updateDoc(doc(db, "shops", shopId), {
    token: newToken,
    lastTokenRefresh: Timestamp.now(),
  });
  return newToken;
}

// Toggle shop status
export async function toggleShopStatus(shopId: string, enabled: boolean) {
  await updateDoc(doc(db, "shops", shopId), { enabled });
}

// Create transaction
export async function createTransaction(
  shopId: string,
  shopName: string,
  amount: number,
  customerId?: string
): Promise<string> {
  const transactionRef = doc(collection(db, "transactions"));
  await setDoc(transactionRef, {
    shopId,
    shopName,
    amount,
    customerId: customerId || null,
    timestamp: Timestamp.now(),
    status: "success",
  });
  return transactionRef.id;
}

// Get all transactions (admin only) — no orderBy
export async function getAllTransactions(): Promise<Transaction[]> {
  const snap = await getDocs(collection(db, "transactions"));
  const txns = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
  return sortByTimestamp(txns);
}

// Get transactions by shop — no orderBy
export async function getTransactionsByShop(shopId: string): Promise<Transaction[]> {
  const q = query(
    collection(db, "transactions"),
    where("shopId", "==", shopId)
  );
  const snap = await getDocs(q);
  const txns = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
  return sortByTimestamp(txns);
}
