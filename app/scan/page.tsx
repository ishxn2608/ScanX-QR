"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [scanMode, setScanMode] = useState<"camera" | "upload">("camera");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const router = useRouter();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scanning && scanMode === "camera") {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          videoConstraints: {
            facingMode: facingMode
          }
        },
        false
      );

      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          handleQRCodeSuccess(decodedText);
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
  }, [scanning, scanMode, facingMode, router]);

  const handleQRCodeSuccess = (decodedText: string) => {
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
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode("qr-reader-upload");
      const decodedText = await html5QrCode.scanFile(file, true);
      handleQRCodeSuccess(decodedText);
    } catch (error) {
      console.error("Error scanning file:", error);
      alert("Failed to scan QR code from image. Please try again or use camera scan.");
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    if (scanning && scanMode === "camera") {
      setScanning(false);
      setTimeout(() => setScanning(true), 100);
    }
  };

  const handleStartScanning = (mode: "camera" | "upload") => {
    setScanMode(mode);
    if (mode === "camera") {
      setScanning(true);
    } else {
      fileInputRef.current?.click();
    }
  };

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
              Scan QR Code
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
                    <p className="text-gray-400">Choose scan method below</p>
                  </div>
                </div>
                
                {/* Scan Options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleStartScanning("camera")}
                    className="btn-neon flex flex-col items-center gap-2 py-4"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Camera</span>
                  </button>
                  
                  <button
                    onClick={() => handleStartScanning("upload")}
                    className="px-6 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 flex flex-col items-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Upload</span>
                  </button>
                </div>
                
                {/* Hidden file input for upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <div id="qr-reader" className="rounded-xl overflow-hidden"></div>
                  
                  {/* Camera Switch Button */}
                  <button
                    onClick={switchCamera}
                    className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full border border-white/20 hover:bg-black/70 transition-all duration-300 z-10"
                    title="Switch Camera"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setScanning(false)}
                    className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    Stop Camera
                  </button>
                  
                  <button
                    onClick={() => {
                      setScanning(false);
                      setTimeout(() => fileInputRef.current?.click(), 100);
                    }}
                    className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Image
                  </button>
                </div>
              </div>
            )}

            {/* Hidden div for file upload scanning */}
            <div id="qr-reader-upload" className="hidden"></div>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-sm text-blue-300">
                💡 <strong>Tip:</strong> Use camera to scan live QR codes or upload an image from your gallery
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
