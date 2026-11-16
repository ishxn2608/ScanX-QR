"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser } from "@/lib/auth";
import Link from "next/link";
import toast from "react-hot-toast";
import ScanXLogo from "@/components/ScanXLogo";

// Password strength criteria
const criteria = [
  { id: "length",    label: "At least 8 characters",        test: (p: string) => p.length >= 8 },
  { id: "upper",     label: "1 uppercase letter (A–Z)",      test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",     label: "1 lowercase letter (a–z)",      test: (p: string) => /[a-z]/.test(p) },
  { id: "special",   label: "1 special character (!@#$…)",   test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordStrengthMeter({ password, role }: { password: string; role: "vendor" | "customer" }) {
  if (!password) return null;

  const passed = criteria.filter((c) => c.test(password)).length;
  const isVendor = role === "vendor";

  const strength =
    passed === 4 ? "Strong" :
    passed === 3 ? "Good" :
    passed === 2 ? "Fair" : "Weak";

  const color =
    passed === 4 ? "bg-green-500" :
    passed === 3 ? "bg-blue-500" :
    passed === 2 ? "bg-yellow-500" : "bg-red-500";

  const textColor =
    passed === 4 ? "text-green-400" :
    passed === 3 ? "text-blue-400" :
    passed === 2 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="mt-3 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${(passed / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className={`text-xs font-semibold ${textColor}`}>{strength}</span>
      </div>

      {/* Criteria checklist — only shown for vendors */}
      {isVendor && (
        <div className="space-y-1 pt-1">
          {criteria.map((c) => {
            const ok = c.test(password);
            return (
              <div key={c.id} className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${ok ? "bg-green-500/20" : "bg-white/5"}`}>
                  {ok ? (
                    <svg className="w-2.5 h-2.5 text-green-400" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <div className="w-1 h-1 rounded-full bg-gray-600" />
                  )}
                </div>
                <span className={`text-xs transition-colors ${ok ? "text-green-400" : "text-gray-500"}`}>{c.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SimpleRegisterPage() {
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName]                   = useState("");
  const [mobileNumber, setMobileNumber]   = useState("");
  const [role, setRole]                   = useState<"vendor" | "customer">("customer");
  const [loading, setLoading]             = useState(false);
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [regError, setRegError]           = useState("");
  const router = useRouter();

  const validatePassword = (): string | null => {
    if (role === "vendor") {
      for (const c of criteria) {
        if (!c.test(password)) return `Password must have ${c.label.toLowerCase()}.`;
      }
    } else {
      if (password.length < 6) return "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    const pwError = validatePassword();
    if (pwError) { setRegError(pwError); return; }

    if (mobileNumber.length !== 10) {
      setRegError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, name, mobileNumber, role);
      toast.success("Account created successfully!");
      if (role === "vendor") {
        toast.success("Your account is pending admin approval", { duration: 5000 });
        router.push("/vendor");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setRegError(err.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12 pt-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="flex justify-center mb-4"
            >
              <ScanXLogo iconSize={44} fontSize={24} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-1">Create Account</h2>
            <p className="text-gray-400 text-sm">Join ScanX QR and get verified instantly</p>
          </div>

          {/* Error box */}
          <AnimatePresence>
            {regError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"
              >
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-sm text-red-300 flex-1">{regError}</p>
                <button onClick={() => setRegError("")} className="text-red-500 hover:text-red-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input type="text" required className="input-glass" placeholder="John Doe"
                value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
              <input type="tel" required maxLength={10} pattern="[0-9]{10}" className="input-glass"
                placeholder="9876543210" value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input type="email" required className="input-glass" placeholder="you@example.com"
                value={email} onChange={(e) => { setEmail(e.target.value); setRegError(""); }} />
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => { setRole("customer"); setRegError(""); }}
                  className={`p-4 rounded-xl border transition-all duration-300 ${role === "customer" ? "bg-blue-500/20 border-blue-500/50 text-blue-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div className="font-semibold text-sm">Customer</div>
                  <div className="text-xs opacity-60 mt-0.5">Scan & pay</div>
                </button>
                <button type="button" onClick={() => { setRole("vendor"); setRegError(""); }}
                  className={`p-4 rounded-xl border transition-all duration-300 ${role === "vendor" ? "bg-purple-500/20 border-purple-500/50 text-purple-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`}>
                  <div className="flex justify-center mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10"/>
                    </svg>
                  </div>
                  <div className="font-semibold text-sm">Vendor</div>
                  <div className="text-xs opacity-60 mt-0.5">Sell & verify</div>
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
                {role === "vendor" && (
                  <span className="ml-2 text-xs text-purple-400 font-normal">(Strong password required for vendors)</span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-glass pr-11"
                  placeholder={role === "vendor" ? "Min 8 chars with A-Z, a-z, !@#" : "Min 6 characters"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setRegError(""); }}
                />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* Live strength meter */}
              <PasswordStrengthMeter password={password} role={role} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  className={`input-glass pr-11 ${passwordsMismatch ? "border-red-500/40" : passwordsMatch ? "border-green-500/40" : ""}`}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setRegError(""); }}
                />
                {/* Match indicator */}
                {confirmPassword && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                )}
                <button type="button" tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showConfirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordsMismatch && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
              {passwordsMatch && (
                <p className="text-xs text-green-400 mt-1">Passwords match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neon disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : "Create Account"}
              </span>
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          By creating an account, you agree to our{" "}
          <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
        </motion.div>
      </motion.div>
    </div>
  );
}
