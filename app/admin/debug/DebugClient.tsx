"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthChange } from "@/lib/auth";

export default function DebugClient() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      console.log("Auth state changed:", user?.email);
      setAuthUser(user);
      if (user) {
        loadData();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("🔍 Loading all users...");
      
      // Try to get all users
      const usersRef = collection(db, "users");
      const allUsersSnap = await getDocs(usersRef);
      
      console.log("📊 All users count:", allUsersSnap.size);
      
      const allUsersData = allUsersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setAllUsers(allUsersData);
      console.log("All users:", allUsersData);

      // Try to get vendors only
      console.log("🔍 Loading vendors...");
      const vendorsQuery = query(usersRef, where("role", "==", "vendor"));
      const vendorsSnap = await getDocs(vendorsQuery);
      
      console.log("📊 Vendors count:", vendorsSnap.size);
      
      const vendorsData = vendorsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setVendors(vendorsData);
      console.log("Vendors:", vendorsData);

    } catch (err: any) {
      console.error("❌ Error loading data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">🔧 Admin Debug Panel</h1>

        {/* Auth Status */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔐 Authentication Status</h2>
          {authUser ? (
            <div className="space-y-2">
              <p className="text-green-400">✅ Logged in</p>
              <p className="text-sm text-gray-400">Email: {authUser.email}</p>
              <p className="text-sm text-gray-400">UID: {authUser.uid}</p>
            </div>
          ) : (
            <p className="text-red-400">❌ Not logged in</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="glass-card p-6 mb-6 border-2 border-red-500/50">
            <h2 className="text-xl font-bold mb-4 text-red-400">❌ Error</h2>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="glass-card p-6 mb-6">
            <p className="text-gray-400">Loading data...</p>
          </div>
        )}

        {/* All Users */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">👥 All Users ({allUsers.length})</h2>
          {allUsers.length === 0 ? (
            <p className="text-gray-400">No users found in database</p>
          ) : (
            <div className="space-y-3">
              {allUsers.map((user) => (
                <div key={user.id} className="bg-white/5 p-4 rounded-lg">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-400">Email: {user.email}</p>
                  <p className="text-sm text-gray-400">Role: {user.role}</p>
                  <p className="text-sm text-gray-400">Status: {user.status}</p>
                  <p className="text-sm text-gray-400">Mobile: {user.mobileNumber}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vendors Only */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🏪 Vendors Only ({vendors.length})</h2>
          {vendors.length === 0 ? (
            <p className="text-gray-400">No vendors found in database</p>
          ) : (
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="bg-white/5 p-4 rounded-lg">
                  <p className="font-semibold">{vendor.name}</p>
                  <p className="text-sm text-gray-400">Email: {vendor.email}</p>
                  <p className="text-sm text-gray-400">Status: {vendor.status}</p>
                  <p className="text-sm text-gray-400">Mobile: {vendor.mobileNumber}</p>
                  <p className="text-sm text-gray-400">
                    Created: {vendor.createdAt?.toDate?.()?.toLocaleString() || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={loadData}
          disabled={loading || !authUser}
          className="btn-neon w-full"
        >
          🔄 Refresh Data
        </button>

        {/* Instructions */}
        <div className="glass-card p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">📋 Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
            <li>Make sure you're logged in as admin (Ishanacharya@gmail.com)</li>
            <li>Check if any users appear in "All Users" section</li>
            <li>Check if vendors appear in "Vendors Only" section</li>
            <li>Open browser console (F12) to see detailed logs</li>
            <li>If you see "permission-denied" error, update Firestore rules</li>
            <li>If no users found, create a test vendor account</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
