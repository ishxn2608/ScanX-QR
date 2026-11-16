"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendPasswordReset } from "@/lib/auth";
import Link from "next/link";
import ScanXLogo from "@/components/ScanXLogo";

type Step = "form" | "sent";

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState<Step>("form");
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setStep("sent");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12 pt-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <ScanXLogo iconSize={42} fontSize={22} />
          </div>

          <AnimatePresence mode="wait">

            {/* ── Step 1: Email form ── */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Header */}
                <div className="text-center mb-7">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">Forgot Password?</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Enter your registered email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {/* Error box */}
                <AnimatePresence>
                  {error && (
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
                      <p className="text-sm text-red-300">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      className={`input-glass ${error ? "border-red-500/40" : ""}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    />
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
                          Sending...
                        </span>
                      ) : "Send Reset Link"}
                    </span>
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Sign In
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Email sent confirmation ── */}
            {step === "sent" && (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Success icon with pulse */}
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute w-24 h-24 rounded-full bg-green-500/10 animate-ping" style={{ animationDuration: "2s" }} />
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-500/20">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">
                  We sent a password reset link to
                </p>
                <p className="text-blue-400 font-semibold text-sm mb-6 break-all">{email}</p>

                {/* Steps */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left space-y-3 mb-6">
                  {[
                    { step: "1", text: "Open your email inbox" },
                    { step: "2", text: "Click the reset link in the email" },
                    { step: "3", text: "Set your new password" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-400">{item.step}</span>
                      </div>
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-3 mb-6 text-left">
                  <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className="text-xs text-yellow-300 leading-relaxed">
                    Didn't receive it? Check your spam folder or{" "}
                    <button
                      onClick={() => { setStep("form"); setError(""); }}
                      className="underline hover:text-yellow-200 transition-colors"
                    >
                      try again
                    </button>
                    . The link expires in 1 hour.
                  </p>
                </div>

                <Link
                  href="/login"
                  className="w-full btn-neon inline-block text-center"
                >
                  <span>Back to Sign In</span>
                </Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
