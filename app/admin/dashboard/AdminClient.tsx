"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { onAuthChange, isAdmin } from "@/lib/auth";
import {
  onVendorsChange,
  updateUserStatus,
  getAllShops,
  getAllTransactions,
  updateShopVerification,
} from "@/lib/firestore";
import { UserData, Shop, Transaction } from "@/lib/types";
import toast from "react-hot-toast";
import ScanXLogo from "@/components/ScanXLogo";

export default function AdminClient() {
  const [user, setUser] = useState<any>(null);
  const [vendors, setVendors] = useState<UserData[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [activeTab, setActiveTab] = useState<"vendors" | "shops" | "transactions">("vendors");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      if (!authUser) {
        console.log("No auth user, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("Auth user found:", authUser.email);

      const adminCheck = await isAdmin(authUser.uid);
      console.log("Admin check result:", adminCheck);
      
      if (!adminCheck) {
        toast.error("Unauthorized access - Not an admin account");
        console.error("User is not admin:", authUser.email);
        router.push("/");
        return;
      }

      console.log("Admin verified, loading dashboard");
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    console.log("Setting up vendors listener for user:", user.email);

    // Real-time listener for vendors
    const unsubscribe = onVendorsChange((vendorsList) => {
      console.log("Vendors updated:", vendorsList.length, "vendors found");
      console.log("Vendors data:", vendorsList);
      setVendors(vendorsList);
    });

    // Load shops and transactions
    loadShopsAndTransactions();

    return () => unsubscribe();
  }, [user]);

  const loadShopsAndTransactions = async () => {
    try {
      const [shopsData, transactionsData] = await Promise.all([
        getAllShops(),
        getAllTransactions(),
      ]);
      setShops(shopsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleApproveVendor = async (vendorId: string, vendorName: string) => {
    const loadingToast = toast.loading("Approving vendor...");
    try {
      console.log("Approving vendor:", vendorId, vendorName);
      await updateUserStatus(vendorId, "approved");
      toast.success(`${vendorName} approved successfully!`, { id: loadingToast });
      console.log("Vendor approved successfully");
    } catch (error: any) {
      console.error("Failed to approve vendor:", error);
      toast.error(`Failed to approve vendor: ${error.message}`, { id: loadingToast });
    }
  };

  const handleRejectVendor = async (vendorId: string, vendorName: string) => {
    if (!confirm(`Are you sure you want to reject ${vendorName}?`)) return;

    const loadingToast = toast.loading("Rejecting vendor...");
    try {
      console.log("Rejecting vendor:", vendorId, vendorName);
      await updateUserStatus(vendorId, "rejected");
      toast.success(`${vendorName} rejected`, { id: loadingToast });
      console.log("Vendor rejected successfully");
    } catch (error: any) {
      console.error("Failed to reject vendor:", error);
      toast.error(`Failed to reject vendor: ${error.message}`, { id: loadingToast });
    }
  };

  const handleVerifyShop = async (shopId: string, verified: boolean) => {
    const loadingToast = toast.loading(verified ? "Verifying shop..." : "Unverifying shop...");
    try {
      await updateShopVerification(shopId, verified);
      await loadShopsAndTransactions();
      toast.success(`Shop ${verified ? "verified" : "unverified"} successfully!`, { id: loadingToast });
    } catch (error) {
      toast.error("Failed to update shop", { id: loadingToast });
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    if (filter === "all") return true;
    return vendor.status === filter;
  });

  const stats = {
    totalVendors: vendors.length,
    pendingVendors: vendors.filter((v) => v.status === "pending").length,
    approvedVendors: vendors.filter((v) => v.status === "approved").length,
    rejectedVendors: vendors.filter((v) => v.status === "rejected").length,
    totalShops: shops.length,
    verifiedShops: shops.filter((s) => s.verified).length,
    totalTransactions: transactions.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <ScanXLogo iconSize={36} fontSize={20} className="mb-2" />
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Manage vendors, shops, and transactions</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Vendors" value={stats.totalVendors} color="blue"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 10-6 0" /></svg>}
          />
          <StatCard title="Pending" value={stats.pendingVendors} color="yellow"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" /></svg>}
          />
          <StatCard title="Approved" value={stats.approvedVendors} color="green"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard title="Total Shops" value={stats.totalShops} color="purple"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" /></svg>}
          />
        </div>

        {/* Tabs */}
        <div className="glass-card p-2 mb-6 inline-flex gap-2">
          <TabButton active={activeTab === "vendors"} onClick={() => setActiveTab("vendors")}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 10-6 0" /></svg>}
          >
            Vendors ({stats.pendingVendors} pending)
          </TabButton>
          <TabButton active={activeTab === "shops"} onClick={() => setActiveTab("shops")}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" /></svg>}
          >
            Shops
          </TabButton>
          <TabButton active={activeTab === "transactions"} onClick={() => setActiveTab("transactions")}
            icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M2 10h20M6 15h4" /></svg>}
          >
            Transactions
          </TabButton>
        </div>

        {/* Vendors Tab */}
        {activeTab === "vendors" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Filter */}
            <div className="glass-card p-4">
              <div className="flex flex-wrap gap-3">
                <FilterButton
                  active={filter === "pending"}
                  onClick={() => setFilter("pending")}
                  count={stats.pendingVendors}
                >
                  Pending
                </FilterButton>
                <FilterButton
                  active={filter === "approved"}
                  onClick={() => setFilter("approved")}
                  count={stats.approvedVendors}
                >
                  Approved
                </FilterButton>
                <FilterButton
                  active={filter === "rejected"}
                  onClick={() => setFilter("rejected")}
                  count={stats.rejectedVendors}
                >
                  Rejected
                </FilterButton>
                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                  count={stats.totalVendors}
                >
                  All
                </FilterButton>
              </div>
            </div>

            {/* Vendors List */}
            <div className="grid gap-4">
              {filteredVendors.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <p className="text-gray-400 text-lg">No vendors found</p>
                </div>
              ) : (
                filteredVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onApprove={handleApproveVendor}
                    onReject={handleRejectVendor}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Shops Tab */}
        {activeTab === "shops" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {shops.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-400 text-lg">No shops found</p>
              </div>
            ) : (
              shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} onVerify={handleVerifyShop} />
              ))
            )}
          </motion.div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 20).map((transaction) => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: React.ReactNode }) {
  const colors: Record<string, string> = {
    blue: "from-blue-500 to-blue-600",
    yellow: "from-yellow-500 to-yellow-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-400">{icon}</div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-2xl font-bold`}>
          {value}
        </div>
      </div>
      <p className="text-sm text-gray-400">{title}</p>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
        active ? "bg-blue-500 text-white" : "text-gray-400 hover:bg-white/5"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function FilterButton({ active, onClick, count, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
        active
          ? "bg-blue-500/20 border-2 border-blue-500 text-blue-300"
          : "bg-white/5 border-2 border-transparent text-gray-400 hover:bg-white/10"
      }`}
    >
      {children} ({count})
    </button>
  );
}

function VendorCard({ vendor, onApprove, onReject }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{vendor.name}</h3>
            {vendor.status === "approved" && (
              <span className="badge-verified text-xs">Approved</span>
            )}
            {vendor.status === "pending" && (
              <span className="badge-pending text-xs">Pending</span>
            )}
            {vendor.status === "rejected" && (
              <span className="badge-failed text-xs">Rejected</span>
            )}
          </div>
          <div className="space-y-1 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {vendor.email}
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +91 {vendor.mobileNumber}
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" /></svg>
              Registered: {vendor.createdAt?.toDate().toLocaleDateString()}
            </p>
          </div>
        </div>

        {vendor.status === "pending" && (
          <div className="flex gap-3">
            <button
              onClick={() => onApprove(vendor.id, vendor.name)}
              className="px-6 py-3 rounded-xl bg-green-500/20 border border-green-500/50 text-green-300 font-semibold hover:bg-green-500/30 transition-all"
            >
              ✓ Approve
            </button>
            <button
              onClick={() => onReject(vendor.id, vendor.name)}
              className="px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 font-semibold hover:bg-red-500/30 transition-all"
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ShopCard({ shop, onVerify }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {shop.imageUrl && (
          <img
            src={shop.imageUrl}
            alt={shop.shopName}
            className="w-full md:w-32 h-32 object-cover rounded-xl"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{shop.shopName}</h3>
            {shop.verified && <span className="badge-verified text-xs">Verified</span>}
          </div>
          <div className="space-y-1 text-sm text-gray-400">
            <p className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M2 10h20M6 15h4" /></svg>
              UPI: {shop.upiId}
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              Token: {shop.token.substring(0, 20)}...
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" /></svg>
              Created: {shop.createdAt?.toDate().toLocaleDateString()}
            </p>
          </div>
        </div>
        <div>
          <button
            onClick={() => onVerify(shop.id, !shop.verified)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              shop.verified
                ? "bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30"
                : "bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30"
            }`}
          >
            {shop.verified ? "Unverify" : "Verify"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function TransactionItem({ transaction }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
      <div>
        <p className="font-semibold">{transaction.shopName}</p>
        <p className="text-sm text-gray-400">
          {transaction.timestamp?.toDate().toLocaleString()}
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold text-green-400">₹{transaction.amount}</p>
        <span className="text-xs badge-verified">{transaction.status}</span>
      </div>
    </div>
  );
}
