"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { onAuthChange, getUserStatus } from "@/lib/auth";
import { getShopsByOwner, createShop, updateShop, regenerateToken, toggleShopStatus } from "@/lib/firestore";
import { Shop } from "@/lib/types";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";
import UpiQrScanner from "@/components/UpiQrScanner";

export default function VendorClient() {
  const [user, setUser] = useState<any>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      if (!authUser) {
        router.push("/login");
      } else {
        console.log("Auth user:", authUser.email);
        setUser(authUser);
        const status = await getUserStatus(authUser.uid);
        console.log("User status:", status);
        setUserStatus(status);
        
        if (status === "approved") {
          await loadShops(authUser.uid);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadShops = async (userId: string) => {
    try {
      const userShops = await getShopsByOwner(userId);
      setShops(userShops);
    } catch (error) {
      console.error("Error loading shops:", error);
      toast.error("Failed to load shops");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show pending approval message
  if (userStatus === "pending") {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-2xl text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Approval Pending</h2>
          <p className="text-xl text-gray-400 mb-6">
            Your vendor account is awaiting admin approval. You'll be able to create shops and generate QR codes once approved.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <p className="text-blue-300 text-sm">
              <strong>What's next?</strong><br />
              Our admin team will review your account shortly. You'll receive access once approved.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show rejected message
  if (userStatus === "rejected") {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-2xl text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Account Not Approved</h2>
          <p className="text-xl text-gray-400 mb-6">
            Unfortunately, your vendor account application was not approved. Please contact support for more information.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="gradient-text">My Shops</span>
            </h1>
            <p className="text-gray-400">Manage your shops and QR codes</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-neon"
            type="button"
          >
            <span>+ Add New Shop</span>
          </button>
        </motion.div>

        {shops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">No shops yet</h3>
            <p className="text-gray-400 mb-6">Create your first shop to get started!</p>
            <button 
              onClick={() => setShowCreateModal(true)} 
              className="btn-neon"
              type="button"
            >
              <span>Create Your First Shop</span>
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop, index) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                index={index}
                onUpdate={() => loadShops(user.uid)}
              />
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateShopModal
            userId={user.uid}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadShops(user.uid);
            }}
          />
        )}
      </div>
    </div>
  );
}

function ShopCard({ shop, index, onUpdate }: { shop: Shop; index: number; onUpdate: () => void }) {
  const [showQR, setShowQR] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [toggling, setToggling] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://secure-upi-payment.vercel.app";
  const paymentUrl = `${appUrl}/pay?token=${shop.token}`;

  const handleRegenerateToken = async () => {
    if (!confirm("Are you sure? This will invalidate your current QR code.")) return;
    
    setRegenerating(true);
    const loadingToast = toast.loading("Regenerating token...");
    try {
      await regenerateToken(shop.id);
      toast.success("Token regenerated successfully!", { id: loadingToast });
      onUpdate();
    } catch (error) {
      toast.error("Failed to regenerate token", { id: loadingToast });
    } finally {
      setRegenerating(false);
    }
  };

  const handleToggleStatus = async () => {
    setToggling(true);
    const loadingToast = toast.loading(shop.enabled ? "Disabling shop..." : "Enabling shop...");
    try {
      await toggleShopStatus(shop.id, !shop.enabled);
      toast.success(`Shop ${shop.enabled ? "disabled" : "enabled"} successfully!`, { id: loadingToast });
      onUpdate();
    } catch (error) {
      toast.error("Failed to toggle shop status", { id: loadingToast });
    } finally {
      setToggling(false);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById(`qr-${shop.id}`) as unknown as SVGElement;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const qrImg = new Image();
    qrImg.onload = () => {
      // Canvas dimensions — A4-ish portrait card
      const W = 720;
      const H = 1020;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // ── Background ──────────────────────────────────────
      ctx.fillStyle = "#0d1b35";
      ctx.fillRect(0, 0, W, H);

      // Subtle card border
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 2;
      roundRect(ctx, 20, 20, W - 40, H - 40, 24);
      ctx.stroke();

      // ── Top header band ──────────────────────────────────
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      roundRect(ctx, 40, 40, W - 80, 150, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ScanX QR logo text
      ctx.font = "bold 52px 'Inter', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText("ScanX", W / 2 - 48, 108);
      ctx.fillStyle = "#3b82f6";
      ctx.fillText(" QR", W / 2 + 70, 108);

      // "SCAN. VERIFY. TRUST."
      ctx.font = "600 15px 'Inter', Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.letterSpacing = "4px";
      ctx.fillText("SCAN.  VERIFY.  TRUST.", W / 2, 148);
      ctx.letterSpacing = "0px";

      // ── "SCAN TO PAY" heading ────────────────────────────
      ctx.font = "bold 46px 'Inter', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("SCAN TO PAY", W / 2, 250);

      // Subtitle
      ctx.font = "400 20px 'Inter', Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText("Verify the shop before you pay", W / 2, 288);

      // ── QR white card ────────────────────────────────────
      const qrCardX = 100;
      const qrCardY = 316;
      const qrCardW = W - 200;
      const qrCardH = 490;

      ctx.fillStyle = "#ffffff";
      roundRect(ctx, qrCardX, qrCardY, qrCardW, qrCardH, 20);
      ctx.fill();

      // Draw QR inside white card (centered, with padding)
      const qrPad = 32;
      ctx.drawImage(
        qrImg,
        qrCardX + qrPad,
        qrCardY + qrPad,
        qrCardW - qrPad * 2,
        qrCardW - qrPad * 2
      );

      // Blue accent bar at bottom of QR card
      ctx.fillStyle = "#3b82f6";
      roundRect(ctx, qrCardX + qrCardW / 2 - 90, qrCardY + qrCardH - 28, 180, 8, 4);
      ctx.fill();

      // ── SHOP NAME section ────────────────────────────────
      ctx.font = "600 15px 'Inter', Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.letterSpacing = "3px";
      ctx.fillText("SHOP NAME", W / 2, 870);
      ctx.letterSpacing = "0px";

      // Divider line
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 886);
      ctx.lineTo(W - 100, 886);
      ctx.stroke();

      // Actual shop name
      ctx.font = "bold 36px 'Inter', Arial, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.letterSpacing = "2px";
      ctx.fillText(shop.shopName.toUpperCase(), W / 2, 938);
      ctx.letterSpacing = "0px";

      // ── Footer ───────────────────────────────────────────
      ctx.font = "400 14px 'Inter', Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillText("Developed by Ishan Acharya", W / 2, 988);

      // Download
      URL.revokeObjectURL(svgUrl);
      const link = document.createElement("a");
      link.download = `${shop.shopName}-ScanX-QR.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    qrImg.src = svgUrl;
  };

  // Helper: draw rounded rect path
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card-hover p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">{shop.shopName}</h3>
            <p className="text-sm text-gray-400">{shop.upiId}</p>
          </div>
          <div className="flex flex-col gap-2">
            {shop.verified ? (
              <span className="badge-verified text-xs">Verified</span>
            ) : (
              <span className="badge-pending text-xs">Pending</span>
            )}
            {shop.enabled ? (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300">Active</span>
            ) : (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-500/20 text-gray-400">Disabled</span>
            )}
          </div>
        </div>

        {shop.imageUrl && (
          <img src={shop.imageUrl} alt={shop.shopName} className="w-full h-40 object-cover rounded-xl mb-4" />
        )}

        <div className="space-y-2">
          <button
            onClick={() => setShowQR(true)}
            className="w-full bg-blue-500/20 border border-blue-500/50 text-blue-300 py-2 rounded-xl hover:bg-blue-500/30 transition-all font-semibold"
          >
            View QR Code
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="w-full bg-white/5 border border-white/10 py-2 rounded-xl hover:bg-white/10 transition-all"
          >
            Edit Shop
          </button>
          <button
            onClick={handleToggleStatus}
            disabled={toggling}
            className={`w-full py-2 rounded-xl font-semibold transition-all ${
              shop.enabled
                ? "bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30"
                : "bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30"
            }`}
          >
            {toggling ? "..." : shop.enabled ? "Disable Shop" : "Enable Shop"}
          </button>
          <button
            onClick={handleRegenerateToken}
            disabled={regenerating}
            className="w-full bg-orange-500/20 border border-orange-500/50 text-orange-300 py-2 rounded-xl hover:bg-orange-500/30 transition-all"
          >
            {regenerating ? "Regenerating..." : "Regenerate QR"}
          </button>
        </div>
      </motion.div>

      {showQR && (
        <QRModal
          shop={shop}
          paymentUrl={paymentUrl}
          onClose={() => setShowQR(false)}
          onDownload={downloadQR}
        />
      )}

      {showEditModal && (
        <EditShopModal
          shop={shop}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}

function QRModal({ shop, paymentUrl, onClose, onDownload }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card p-8 max-w-md w-full"
      >
        <h3 className="text-2xl font-bold mb-4 text-center">{shop.shopName}</h3>
        <div className="flex justify-center mb-4 bg-white p-4 rounded-xl">
          <QRCodeSVG id={`qr-${shop.id}`} value={paymentUrl} size={256} level="H" />
        </div>
        <p className="text-sm text-gray-400 text-center mb-4 break-all">{paymentUrl}</p>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            className="flex-1 btn-neon"
          >
            <span>Download QR</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreateShopModal({ userId, onClose, onSuccess }: any) {
  const [shopName, setShopName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB for faster upload)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!shopName.trim()) {
      toast.error("Shop name is required");
      return;
    }
    if (!upiId.trim()) {
      toast.error("UPI ID is required");
      return;
    }
    if (!upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g., yourname@upi)");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating shop...");

    try {
      let imageUrl = "";
      
      if (image) {
        try {
          console.log("📤 Starting image upload to Cloudinary...", {
            name: image.name,
            size: `${(image.size / 1024).toFixed(2)} KB`,
            type: image.type
          });
          
          setUploadProgress("Uploading image...");
          
          // Upload to Cloudinary (Free alternative)
          imageUrl = await uploadImageToCloudinary(image);
          
          console.log("✅ Image uploaded successfully:", imageUrl);
          
        } catch (uploadError: any) {
          console.error("❌ Image upload failed:", uploadError);
          console.log("⚠️ Continuing without image");
          imageUrl = "";
        }
      }

      console.log("🏪 Creating shop...", { userId, shopName, upiId, hasImage: !!imageUrl });
      setUploadProgress("Creating shop...");
      
      const result = await createShop(userId, shopName, upiId, imageUrl);
      console.log("✅ Shop created successfully:", result);
      
      const successMessage = imageUrl 
        ? "Shop created successfully!" 
        : "Shop created successfully (without image)";
      
      toast.success(successMessage, { id: loadingToast });
      onSuccess();
      
    } catch (err: any) {
      console.error("❌ Shop creation error:", err);
      
      let errorMessage = "Failed to create shop";
      if (err.message.includes("Only approved vendors")) {
        errorMessage = "Your vendor account is not approved yet.";
      } else if (err.message.includes("permission-denied")) {
        errorMessage = "Permission denied. Please check your account status.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
      setUploadProgress("");
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6">Create New Shop</h2>
        <form onSubmit={handleSubmit} className="space-y-4">          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Shop Name *</label>
            <input
              type="text"
              required
              className="input-glass"
              placeholder="My Shop"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">UPI ID *</label>
            
            {/* UPI QR Scan Button */}
            <button
              type="button"
              onClick={() => setShowQrScanner(true)}
              disabled={loading}
              className="w-full mb-2 py-3 rounded-xl border-2 border-dashed border-blue-500/50 text-blue-300 hover:bg-blue-500/10 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              </svg>
              Scan Official UPI QR Code
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Recommended</span>
            </button>

            <div className="relative">
              <input
                type="text"
                required
                placeholder="yourname@paytm"
                className={`input-glass pr-10 ${upiVerified ? "border-green-500/50" : ""}`}
                value={upiId}
                onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false); }}
                disabled={loading}
              />
              {upiVerified && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>

            {upiVerified ? (
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/></svg>
                Verified via UPI QR — 100% genuine
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">e.g. yourname@paytm, yourname@phonepe — or scan your QR above</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Shop Image (Optional, max 2MB)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 file:cursor-pointer"
              onChange={handleImageChange}
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">
              Recommended: Square image, JPG or PNG format. You can add image later if upload is slow.
            </p>
            
            {imagePreview && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">Preview:</p>
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview("");
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border border-white/10"
                />
              </div>
            )}
          </div>
          
          {uploadProgress && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {uploadProgress}
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-neon disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Creating..." : "Create Shop"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>

    {showQrScanner && (
      <UpiQrScanner
        onScanSuccess={(data) => {
          setUpiId(data.upiId);
          if (!shopName && data.shopName) setShopName(data.shopName);
          setUpiVerified(true);
          setShowQrScanner(false);
          toast.success(`UPI ID detected: ${data.upiId}`);
        }}
        onClose={() => setShowQrScanner(false)}
      />
    )}
    </>
  );
}

function EditShopModal({ shop, onClose, onSuccess }: any) {
  const [shopName, setShopName] = useState(shop.shopName);
  const [upiId, setUpiId] = useState(shop.upiId);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(shop.imageUrl || "");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [upiVerified, setUpiVerified] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Updating shop...");

    try {
      let imageUrl = shop.imageUrl;
      
      if (image) {
        try {
          console.log("📤 Starting image upload to Cloudinary...");
          setUploadProgress("Uploading image...");
          
          // Upload to Cloudinary (Free alternative)
          imageUrl = await uploadImageToCloudinary(image);
          
          console.log("✅ Image uploaded successfully");
          
        } catch (uploadError: any) {
          console.error("❌ Image upload failed:", uploadError);
          console.log("⚠️ Keeping existing image");
          imageUrl = shop.imageUrl;
        }
      }

      setUploadProgress("Updating shop...");
      await updateShop(shop.id, { shopName, upiId, imageUrl });
      
      toast.success("Shop updated successfully!", { id: loadingToast });
      onSuccess();
      
    } catch (err: any) {
      console.error("❌ Shop update error:", err);
      toast.error(err.message || "Failed to update shop", { id: loadingToast });
    } finally {
      setLoading(false);
      setUploadProgress("");
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6">Edit Shop</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Shop Name</label>
            <input
              type="text"
              required
              className="input-glass"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">UPI ID</label>
            {/* UPI QR Scan Button */}
            <button
              type="button"
              onClick={() => setShowQrScanner(true)}
              disabled={loading}
              className="w-full mb-2 py-2.5 rounded-xl border-2 border-dashed border-blue-500/50 text-blue-300 hover:bg-blue-500/10 transition-all font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              </svg>
              Update UPI ID by Scanning QR Code
            </button>
            <div className="relative">
              <input
                type="text"
                required
                className={`input-glass pr-10 ${upiVerified ? "border-green-500/50" : ""}`}
                value={upiId}
                onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false); }}
                disabled={loading}
              />
              {upiVerified && (
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            {upiVerified && (
              <p className="text-xs text-green-400 mt-1">Verified via QR</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Update Shop Image (Optional, max 2MB)
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30 file:cursor-pointer"
              onChange={handleImageChange}
              disabled={loading}
            />
            
            {imagePreview && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2">
                  {image ? "New image preview:" : "Current image:"}
                </p>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border border-white/10"
                />
              </div>
            )}
          </div>
          
          {uploadProgress && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {uploadProgress}
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-neon disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Updating..." : "Update Shop"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>

    {showQrScanner && (
      <UpiQrScanner
        onScanSuccess={(data) => {
          setUpiId(data.upiId);
          if (data.shopName) setShopName(data.shopName);
          setUpiVerified(true);
          setShowQrScanner(false);
          toast.success(`UPI ID detected: ${data.upiId}`);
        }}
        onClose={() => setShowQrScanner(false)}
      />
    )}
    </>
  );
}
