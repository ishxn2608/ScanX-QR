"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

interface UpiData {
  upiId: string;
  shopName: string;
  rawQr: string;
}

interface Props {
  onScanSuccess: (data: UpiData) => void;
  onClose: () => void;
}

function parseUpiQr(raw: string): UpiData | null {
  try {
    const url = new URL(
      raw.replace("upi://pay?", "https://dummy.com?").replace("upi://pay/", "https://dummy.com?")
    );
    const pa = url.searchParams.get("pa");
    const pn = url.searchParams.get("pn");
    if (!pa || !pa.includes("@")) return null;
    return {
      upiId: pa.trim(),
      shopName: pn ? decodeURIComponent(pn.replace(/\+/g, " ")).trim() : "",
      rawQr: raw,
    };
  } catch {
    return null;
  }
}

/* ── Real SVG logos for each UPI app ── */
const PhonePeLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="24" cy="24" r="24" fill="#5F259F"/>
    <path d="M31.5 14h-8.3c-.9 0-1.7.5-2.1 1.3L14 28.5c-.6 1.1.2 2.5 1.5 2.5h4.2l-1.8 5.5c-.3.9.6 1.8 1.5 1.4l13-7.4c1-.6 1-2 0-2.6l-4.3-2.4 4-6.9c.6-1.1-.2-2.6-1.6-2.6z" fill="white"/>
  </svg>
);

const GooglePayLogo = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="24" cy="24" r="24" fill="white"/>
    <text x="24" y="20" textAnchor="middle" fontSize="8" fontWeight="800" fontFamily="'Product Sans', Arial, sans-serif">
      <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
    </text>
    <text x="24" y="30" textAnchor="middle" fontSize="7.5" fontWeight="700" fontFamily="'Product Sans', Arial, sans-serif" fill="#5F6368">Pay</text>
  </svg>
);

const PaytmLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="24" cy="24" r="24" fill="#00BAF2"/>
    <text x="24" y="27" textAnchor="middle" fontSize="10" fontWeight="800" fontFamily="Arial, sans-serif" fill="white" letterSpacing="-0.5">Paytm</text>
  </svg>
);

const BhimLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="24" cy="24" r="24" fill="#00529C"/>
    <text x="24" y="22" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="Arial, sans-serif" fill="white">BHIM</text>
    <text x="24" y="31" textAnchor="middle" fontSize="6" fontFamily="Arial, sans-serif" fill="#F0A500">UPI</text>
  </svg>
);

const AmazonPayLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="24" cy="24" r="24" fill="#232F3E"/>
    <text x="24" y="22" textAnchor="middle" fontSize="6.5" fontWeight="700" fontFamily="Arial, sans-serif" fill="white">amazon</text>
    <text x="24" y="30" textAnchor="middle" fontSize="7" fontWeight="800" fontFamily="Arial, sans-serif" fill="#FF9900">pay</text>
  </svg>
);

const CredsLogo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="24" cy="24" r="24" fill="#1A1A2E"/>
    <text x="24" y="27" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="Arial, sans-serif" fill="white" letterSpacing="1">CRED</text>
  </svg>
);

const upiApps = [
  { name: "PhonePe",   Logo: PhonePeLogo },
  { name: "Google Pay", Logo: GooglePayLogo },
  { name: "Paytm",     Logo: PaytmLogo },
  { name: "BHIM",      Logo: BhimLogo },
  { name: "Amazon Pay",Logo: AmazonPayLogo },
  { name: "CRED",      Logo: CredsLogo },
];

/* ── Camera Permission Screen ── */
function CameraPermissionScreen({ onAllow, onDeny }: { onAllow: () => void; onDeny: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">

      {/* Animated camera icon with pulse rings */}
      <div className="relative flex items-center justify-center mb-6 mt-2">
        {/* Outer pulse ring */}
        <div className="absolute w-28 h-28 rounded-full border border-blue-500/20 animate-ping" style={{ animationDuration: "2.5s" }} />
        {/* Middle ring */}
        <div className="absolute w-24 h-24 rounded-full border border-blue-500/30" />
        {/* Inner circle */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl shadow-blue-500/30 flex items-center justify-center">
          <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Allow Camera Access</h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
        We need your camera to scan your official UPI QR code and auto-verify your shop.
      </p>

      {/* Permission cards */}
      <div className="w-full space-y-2 mb-6">
        {[
          {
            color: "bg-green-500/10 border-green-500/20",
            iconColor: "text-green-400",
            iconBg: "bg-green-500/15",
            icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Scan UPI QR Code",
            sub: "Detect your PhonePe / Paytm / GPay merchant QR",
          },
          {
            color: "bg-blue-500/10 border-blue-500/20",
            iconColor: "text-blue-400",
            iconBg: "bg-blue-500/15",
            icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            title: "Auto-fill Shop Details",
            sub: "UPI ID and shop name filled automatically",
          },
          {
            color: "bg-red-500/10 border-red-500/20",
            iconColor: "text-red-400",
            iconBg: "bg-red-500/15",
            icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
            title: "No Data Stored",
            sub: "Camera feed is never recorded or uploaded",
          },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${item.color}`}>
            <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-4 h-4 ${item.iconColor}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white">{item.title}</p>
              <p className="text-xs text-gray-500 leading-tight">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={onDeny}
          className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-semibold hover:bg-white/5 transition-all"
        >
          Upload Image
        </button>
        <button
          onClick={onAllow}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
          Allow Camera
        </button>
      </div>
    </div>
  );
}

/* ── Main Scanner ── */
export default function UpiQrScanner({ onScanSuccess, onClose }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animRef   = useRef<number>(0);

  const [phase, setPhase]               = useState<"permission" | "camera" | "upload">("permission");
  const [cameraStarted, setCameraStarted] = useState(false);
  const [error, setError]               = useState("");

  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraStarted(true);
        scanLoop();
      }
    } catch {
      setError("Camera access was denied. Please use the 'Upload QR Image' option instead.");
      setPhase("upload");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    cancelAnimationFrame(animRef.current);
    setCameraStarted(false);
  };

  const scanLoop = () => {
    animRef.current = requestAnimationFrame(() => {
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) { scanLoop(); return; }
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code?.data) {
        const upiData = parseUpiQr(code.data);
        if (upiData) { stopCamera(); onScanSuccess(upiData); return; }
        setError("This is not a UPI QR code. Please scan your official shop UPI QR code.");
      }
      scanLoop();
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width  = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code?.data) {
          const upiData = parseUpiQr(code.data);
          if (upiData) { onScanSuccess(upiData); return; }
          setError("This is not a UPI QR code. Please upload your official PhonePe / Paytm / Google Pay QR image.");
        } else {
          setError("No QR code found in the image. Please upload a clear QR code image.");
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (phase === "camera") startCamera();
    else stopCamera();
    return () => stopCamera();
  }, [phase]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#111318] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* QR icon — SVG */}
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 17.25h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75V13.5zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75V13.5zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Verify with UPI QR Code</p>
              <p className="text-xs text-gray-500">Scan your official merchant QR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">

          {/* ── Phase: Permission ── */}
          {phase === "permission" && (
            <CameraPermissionScreen
              onAllow={() => setPhase("camera")}
              onDeny={() => setPhase("upload")}
            />
          )}

          {/* ── Phase: Camera ── */}
          {phase === "camera" && (
            <div>
              <div className="relative rounded-xl overflow-hidden bg-black aspect-square mb-3">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

                {/* Dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

                {/* Scan frame */}
                {cameraStarted && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative w-52 h-52">
                      <div className="absolute top-0    left-0  w-10 h-10 border-t-[3px] border-l-[3px] border-blue-400 rounded-tl-xl" />
                      <div className="absolute top-0    right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-blue-400 rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0  w-10 h-10 border-b-[3px] border-l-[3px] border-blue-400 rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-blue-400 rounded-br-xl" />
                      {/* Animated scan line */}
                      <div
                        className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                        style={{ animation: "scanline 2s ease-in-out infinite" }}
                      />
                    </div>
                  </div>
                )}

                {/* Loading spinner before camera ready */}
                {!cameraStarted && !error && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/10 border-t-blue-400" />
                    <p className="text-xs text-gray-400">Starting camera...</p>
                  </div>
                )}
              </div>

              {cameraStarted && (
                <p className="text-center text-xs text-gray-400 mb-3 animate-pulse">
                  Position your UPI QR code inside the frame
                </p>
              )}

              <button
                onClick={() => setPhase("upload")}
                className="w-full py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-all"
              >
                Switch to Image Upload Instead
              </button>
            </div>
          )}

          {/* ── Phase: Upload ── */}
          {phase === "upload" && (
            <div>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-white/15 hover:border-blue-500/50 rounded-xl p-7 text-center transition-all group mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-blue-500/10 border border-white/10 flex items-center justify-center mx-auto mb-3 transition-all">
                    <svg className="w-7 h-7 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">Upload your UPI QR Code image</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10 MB</p>
                  <span className="inline-block mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all">
                    Choose File
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </div>
              </label>

              <button
                onClick={() => setPhase("permission")}
                className="w-full py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:bg-white/5 transition-all"
              >
                Use Camera Instead
              </button>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="mt-3 flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-red-300 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          {/* ── UPI App Logos ── */}
          <div className="mt-5 pt-4 border-t border-white/8">
            <p className="text-xs text-gray-500 text-center mb-3">Supported UPI apps</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {upiApps.map(({ name, Logo }) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <div className="w-9 h-9 rounded-full overflow-hidden shadow-md ring-1 ring-white/10">
                    <Logo />
                  </div>
                  <span className="text-[9px] text-gray-500 leading-tight text-center w-10 truncate">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Scan line keyframe */}
      <style>{`
        @keyframes scanline {
          0%   { top: 8px;  opacity: 1; }
          50%  { top: calc(100% - 8px); opacity: 1; }
          100% { top: 8px;  opacity: 1; }
        }
      `}</style>
    </div>
  );
}
