"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (scanning) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scanner.render(
        (decodedText) => {
          // Extract token from URL
          try {
            const url = new URL(decodedText);
            const token = url.searchParams.get("token");
            if (token) {
              router.push(`/pay?token=${token}`);
            }
          } catch {
            // If not a URL, treat as token directly
            router.push(`/pay?token=${decodedText}`);
          }
          scanner.clear();
        },
        (error) => {
          console.log(error);
        }
      );

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [scanning, router]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      try {
        const url = new URL(manualInput);
        const token = url.searchParams.get("token");
        if (token) {
          router.push(`/pay?token=${token}`);
        }
      } catch {
        router.push(`/pay?token=${manualInput}`);
      }
    }
  };

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Scan QR Code</span>
          </h1>
          <p className="text-xl text-gray-400">
            Verify merchant authenticity before making payment
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Camera Scanner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">📷</span>
              Camera Scan
            </h2>

            {!scanning ? (
              <div className="space-y-6">
                <div className="aspect-square bg-white/5 rounded-xl flex items-center justify-center border-2 border-dashed border-white/20">
                  <div className="text-center">
                    <svg
                      className="w-24 h-24 mx-auto mb-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <p className="text-gray-400">Camera preview will appear here</p>
                  </div>
                </div>
                <button
                  onClick={() => setScanning(true)}
                  className="w-full btn-neon"
                >
                  <span>Start Camera</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div id="qr-reader" className="rounded-xl overflow-hidden"></div>
                <button
                  onClick={() => setScanning(false)}
                  className="w-full px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  Stop Scanning
                </button>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-sm text-blue-300">
                💡 <strong>Tip:</strong> Point your camera at the merchant's QR code
              </p>
            </div>
          </motion.div>

          {/* Manual Input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass-card p-8"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">⌨️</span>
              Manual Entry
            </h2>

            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Link or Token
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Paste payment link or token"
                  className="input-glass"
                />
              </div>

              <button type="submit" className="w-full btn-neon">
                <span>Verify Payment</span>
              </button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-sm text-yellow-300">
                  ⚠️ <strong>Security Notice:</strong> Only scan QR codes from trusted sources
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-300">How it works:</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Scan or enter payment link</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>System verifies merchant in real-time</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>View merchant details and verification status</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Proceed with secure payment</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <SecurityFeature
            icon="🔒"
            title="Encrypted"
            description="All data is encrypted end-to-end"
          />
          <SecurityFeature
            icon="⚡"
            title="Instant"
            description="Real-time verification in milliseconds"
          />
          <SecurityFeature
            icon="🛡️"
            title="Protected"
            description="Fraud detection and prevention"
          />
        </motion.div>
      </div>
    </div>
  );
}

function SecurityFeature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card p-6 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
