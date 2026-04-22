"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { onAuthChange, getUserStatus } from "@/lib/auth";
import { getShopsByOwner, createShop, updateShop, regenerateToken, toggleShopStatus } from "@/lib/firestore";
import { Shop } from "@/lib/types";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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
    const url = URL.createObjectURL(svgBlob);

    // Convert SVG to PNG via canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${shop.shopName}-QR.png`;
      link.href = pngUrl;
      link.click();
    };
    img.src = url;
  };

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
  const [loading, setLoading] = useState(false);

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
        console.log("Uploading image...");
        const storageRef = ref(storage, `shop-images/${userId}/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully:", imageUrl);
      }

      console.log("Creating shop with data:", { userId, shopName, upiId, imageUrl });
      const result = await createShop(userId, shopName, upiId, imageUrl);
      console.log("Shop created successfully:", result);
      
      toast.success("Shop created successfully!", { id: loadingToast });
      onSuccess();
    } catch (err: any) {
      console.error("Shop creation error:", err);
      
      // Provide more specific error messages
      let errorMessage = "Failed to create shop";
      if (err.message.includes("Only approved vendors")) {
        errorMessage = "Your vendor account is not approved yet. Please wait for admin approval.";
      } else if (err.message.includes("permission-denied")) {
        errorMessage = "Permission denied. Please check your account status.";
      } else if (err.message.includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
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
        className="glass-card p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6">Create New Shop</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Shop Name</label>
            <input
              type="text"
              required
              className="input-glass"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">UPI ID</label>
            <input
              type="text"
              required
              placeholder="yourname@upi"
              className="input-glass"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Shop Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-gray-300"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-neon disabled:opacity-50"
            >
              <span>{loading ? "Creating..." : "Create Shop"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function EditShopModal({ shop, onClose, onSuccess }: any) {
  const [shopName, setShopName] = useState(shop.shopName);
  const [upiId, setUpiId] = useState(shop.upiId);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Updating shop...");

    try {
      let imageUrl = shop.imageUrl;
      if (image) {
        const storageRef = ref(storage, `shop-images/${shop.ownerId}/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await updateShop(shop.id, { shopName, upiId, imageUrl });
      toast.success("Shop updated successfully!", { id: loadingToast });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to update shop", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
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
        className="glass-card p-8 max-w-md w-full"
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">UPI ID</label>
            <input
              type="text"
              required
              className="input-glass"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Update Shop Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-gray-300"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-neon disabled:opacity-50"
            >
              <span>{loading ? "Updating..." : "Update Shop"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
