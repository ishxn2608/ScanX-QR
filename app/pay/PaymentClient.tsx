"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getShopByToken } from "@/lib/firestore";
import { Shop } from "@/lib/types";

// UPI payment apps with their deep-link schemes
const UPI_APPS = [
  {
    name: "Google Pay",
    id: "gpay",
    color: "from-blue-500 to-green-500",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z" fill="#EA4335"/>
        <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#4285F4"/>
        <path d="M10.53 28.59c-.48-1.37-.76-2.84-.76-4.59s.27-3.22.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05"/>
        <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#34A853"/>
      </svg>
    ),
    getLink: (upiId: string, name: string) =>
      `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
    fallback: (upiId: string, name: string) =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
  },
  {
    name: "PhonePe",
    id: "phonepe",
    color: "from-purple-600 to-indigo-600",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect width="48" height="48" rx="12" fill="#5F259F"/>
        <path d="M24 8c-8.84 0-16 7.16-16 16s7.16 16 16 16 16-7.16 16-16S32.84 8 24 8zm0 4c6.63 0 12 5.37 12 12s-5.37 12-12 12S12 30.63 12 24s5.37-12 12-12z" fill="white" opacity="0.3"/>
        <path d="M20 17h4c2.76 0 5 2.24 5 5s-2.24 5-5 5h-2v4h-2V17zm2 8h2c1.65 0 3-1.35 3-3s-1.35-3-3-3h-2v6z" fill="white"/>
      </svg>
    ),
    getLink: (upiId: string, name: string) =>
      `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
    fallback: (upiId: string, name: string) =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
  },
  {
    name: "Paytm",
    id: "paytm",
    color: "from-blue-400 to-cyan-500",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/10",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect width="48" height="48" rx="12" fill="#00BAF2"/>
        <text x="8" y="32" fontSize="18" fontWeight="bold" fill="white" fontFamily="Arial">Pay</text>
        <text x="8" y="44" fontSize="10" fill="white" fontFamily="Arial" opacity="0.8">tm</text>
      </svg>
    ),
    getLink: (upiId: string, name: string) =>
      `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
    fallback: (upiId: string, name: string) =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
  },
  {
    name: "BHIM UPI",
    id: "bhim",
    color: "from-orange-500 to-red-500",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect width="48" height="48" rx="12" fill="#FF6600"/>
        <path d="M12 14h8c5.52 0 10 4.48 10 10s-4.48 10-10 10H12V14zm4 4v12h4c3.31 0 6-2.69 6-6s-2.69-6-6-6h-4z" fill="white"/>
        <rect x="28" y="14" width="4" height="20" fill="white"/>
      </svg>
    ),
    getLink: (upiId: string, name: string) =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
    fallback: (upiId: string, name: string) =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
  },
  {
    name: "Amazon Pay",
    id: "amazonpay",
    color: "from-yellow-500 to-orange-400",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect width="48" height="48" rx="12" fill="#FF9900"/>
        <text x="6" y="28" fontSize="11" fontWeight="bold" fill="white" fontFamily="Arial">amazon</text>
        <path d="M8 32c8 4 24 4 32 0" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M36 30l4 2-2 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    getLink: (upiId: string, name: string) =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
    fallback: (upiId: string, name: string) =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
  },
  {
    name: "Other UPI",
    id: "other",
    color: "from-gray-500 to-gray-600",
    border: "border-gray-500/30",
    bg: "bg-gray-500/10",
    icon: (
      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path strokeLinecap="round" d="M2 10h20M6 15h4"/>
      </svg>
    ),
    getLink: (upiId: string, name: string) =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
    fallback: (upiId: string, name: string) =>
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&cu=INR`,
  },
];

export default function PaymentClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [shop, setShop] = useState<Shop | null>(null);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [showAppChooser, setShowAppChooser] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid payment link — no token found");
      setVerifying(false);
      return;
    }
    verifyShop();
  }, [token]);

  const verifyShop = async () => {
    try {
      await new Promise((r) => setTimeout(r, 1400)); // brief UX delay
      const shopData = await getShopByToken(token!);
      if (!shopData) {
        setError("Shop not found or QR code is invalid");
      } else if (!shopData.enabled) {
        setError("This shop is currently disabled by the admin");
      } else {
        setShop(shopData);
      }
    } catch {
      setError("Failed to verify shop. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleAppPay = (app: typeof UPI_APPS[0]) => {
    if (!shop) return;
    setSelectedApp(app.id);
    const link = app.getLink(shop.upiId, shop.shopName);
    // Try deep link; if it fails (desktop/no app), fall back to generic UPI
    window.location.href = link;
    // Fallback after 1.5s if app didn't open
    setTimeout(() => {
      window.location.href = app.fallback(shop.upiId, shop.shopName);
    }, 1500);
  };

  // ── Verifying screen ──────────────────────────────────────────────────────
  if (verifying) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center px-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-blue-500 border-t-transparent"
          />
          <h2 className="text-2xl font-bold mb-2">Verifying Merchant</h2>
          <p className="text-gray-400 text-sm">Checking QR code authenticity with ScanX QR…</p>
          <div className="mt-6 flex items-center justify-center gap-2">
            {[0, 0.2, 0.4].map((d, i) => (
              <motion.div key={i} animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: d }}
                className="w-2 h-2 bg-blue-500 rounded-full" />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Error screen ──────────────────────────────────────────────────────────
  if (error || !shop) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Verification Failed</h2>
          <p className="text-red-400 mb-6 text-sm">{error}</p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-left">
            <p className="text-sm font-semibold text-red-300 mb-1">Security Warning</p>
            <p className="text-xs text-red-200 leading-relaxed">
              This QR code could not be verified by ScanX QR. Do not proceed with any payment — this may be a fraudulent QR code.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Verified + App Chooser ────────────────────────────────────────────────
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-4">

        {/* Verification card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }} className="glass-card p-6">

          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
                <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
                <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <span className="text-sm font-bold gradient-text">ScanX QR</span>
          </div>

          {/* Verification status */}
          <div className="text-center mb-5">
            {shop.verified ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified Merchant
              </motion.div>
            ) : (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Pending Verification
              </div>
            )}
          </div>

          {/* Shop image */}
          {shop.imageUrl && (
            <img src={shop.imageUrl} alt={shop.shopName}
              className="w-full h-40 object-cover rounded-xl mb-4" />
          )}

          {/* Shop info */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold mb-2">{shop.shopName}</h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M2 10h20M6 15h4"/>
              </svg>
              <span className="text-xs text-gray-400">UPI:</span>
              <span className="text-xs font-mono text-blue-400">{shop.upiId}</span>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl p-4">
            <svg className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5-3.5 9.3-7 10.5C8.5 19.3 5 15 5 10V5l7-3z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4"/>
            </svg>
            <p className="text-xs text-blue-200 leading-relaxed">
              This merchant is registered and verified by ScanX QR. Your payment is protected.
            </p>
          </div>

          {/* Unverified warning */}
          {!shop.verified && (
            <div className="mt-3 flex items-start gap-3 bg-yellow-500/8 border border-yellow-500/20 rounded-xl p-4">
              <svg className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              <p className="text-xs text-yellow-200 leading-relaxed">
                This merchant is awaiting admin verification. The QR is authentic but proceed with caution.
              </p>
            </div>
          )}
        </motion.div>

        {/* Pay button */}
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAppChooser(true)}
          className="w-full btn-neon py-4 text-base font-bold"
        >
          <span>Choose Payment App</span>
        </motion.button>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-500">
          Select your preferred UPI app to complete the payment
        </motion.p>
      </motion.div>

      {/* ── App Chooser Modal ── */}
      <AnimatePresence>
        {showAppChooser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
            onClick={() => setShowAppChooser(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-md"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold">Pay with UPI</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Paying to <span className="text-white font-medium">{shop.shopName}</span></p>
                </div>
                <button onClick={() => setShowAppChooser(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* UPI ID display */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10 mb-5">
                <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <rect x="2" y="5" width="20" height="14" rx="2"/><path strokeLinecap="round" d="M2 10h20M6 15h4"/>
                </svg>
                <span className="text-xs text-gray-400">UPI ID:</span>
                <span className="text-xs font-mono text-blue-400 flex-1">{shop.upiId}</span>
              </div>

              {/* App grid */}
              <div className="grid grid-cols-3 gap-3">
                {UPI_APPS.map((app) => (
                  <motion.button
                    key={app.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAppPay(app)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 ${
                      selectedApp === app.id
                        ? `${app.bg} ${app.border} border-2`
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg`}>
                      {app.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-300 text-center leading-tight">{app.name}</span>
                  </motion.button>
                ))}
              </div>

              <p className="text-center text-xs text-gray-600 mt-4">
                Tap an app to open it and complete payment
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
