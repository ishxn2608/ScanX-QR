"use client";

import { useEffect, useState } from "react";
import { onAuthChange, isAdmin, getUserRole } from "@/lib/auth";
import { getAllVendors, getUser } from "@/lib/firestore";

export default function AdminDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      const info: any = {
        timestamp: new Date().toISOString(),
        authUser: null,
        isAdminCheck: false,
        userRole: null,
        firestoreUser: null,
        vendors: [],
        errors: [],
      };

      try {
        if (authUser) {
          info.authUser = {
            uid: authUser.uid,
            email: authUser.email,
            emailVerified: authUser.emailVerified,
          };

          // Check if admin
          try {
            info.isAdminCheck = await isAdmin(authUser.uid);
          } catch (err: any) {
            info.errors.push(`isAdmin error: ${err.message}`);
          }

          // Get user role
          try {
            info.userRole = await getUserRole(authUser.uid);
          } catch (err: any) {
            info.errors.push(`getUserRole error: ${err.message}`);
          }

          // Get Firestore user document
          try {
            info.firestoreUser = await getUser(authUser.uid);
          } catch (err: any) {
            info.errors.push(`getUser error: ${err.message}`);
          }

          // Try to get vendors (admin only)
          if (info.isAdminCheck) {
            try {
              const vendorsList = await getAllVendors();
              info.vendors = vendorsList.map((v) => ({
                id: v.id,
                name: v.name,
                email: v.email,
                status: v.status,
                role: v.role,
              }));
            } catch (err: any) {
              info.errors.push(`getAllVendors error: ${err.message}`);
            }
          }
        } else {
          info.errors.push("No authenticated user");
        }
      } catch (err: any) {
        info.errors.push(`General error: ${err.message}`);
      }

      setDebugInfo(info);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading debug info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Admin Debug Info</h1>

        <div className="space-y-6">
          {/* Timestamp */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Timestamp</h2>
            <pre className="bg-black/30 p-4 rounded-lg overflow-auto">
              {debugInfo.timestamp}
            </pre>
          </div>

          {/* Auth User */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Firebase Auth User</h2>
            <pre className="bg-black/30 p-4 rounded-lg overflow-auto">
              {JSON.stringify(debugInfo.authUser, null, 2)}
            </pre>
          </div>

          {/* Admin Check */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Admin Check Result</h2>
            <div className={`p-4 rounded-lg ${debugInfo.isAdminCheck ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <p className="text-lg font-semibold">
                {debugInfo.isAdminCheck ? '✅ IS ADMIN' : '❌ NOT ADMIN'}
              </p>
            </div>
          </div>

          {/* User Role */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">User Role</h2>
            <pre className="bg-black/30 p-4 rounded-lg overflow-auto">
              {JSON.stringify(debugInfo.userRole, null, 2)}
            </pre>
          </div>

          {/* Firestore User Document */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Firestore User Document</h2>
            <pre className="bg-black/30 p-4 rounded-lg overflow-auto">
              {JSON.stringify(debugInfo.firestoreUser, null, 2)}
            </pre>
          </div>

          {/* Vendors */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold mb-4">Vendors ({debugInfo.vendors?.length || 0})</h2>
            <pre className="bg-black/30 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(debugInfo.vendors, null, 2)}
            </pre>
          </div>

          {/* Errors */}
          {debugInfo.errors && debugInfo.errors.length > 0 && (
            <div className="glass-card p-6 border-2 border-red-500/50">
              <h2 className="text-xl font-bold mb-4 text-red-400">Errors</h2>
              <div className="space-y-2">
                {debugInfo.errors.map((error: string, index: number) => (
                  <div key={index} className="bg-red-500/20 p-3 rounded-lg">
                    <p className="text-red-300">{error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="glass-card p-6 bg-blue-500/10 border border-blue-500/30">
            <h2 className="text-xl font-bold mb-4">What to Check</h2>
            <ul className="space-y-2 text-sm">
              <li>✅ <strong>Auth User:</strong> Should show your admin email (Ishanacharya@gmail.com)</li>
              <li>✅ <strong>Admin Check:</strong> Should be TRUE</li>
              <li>✅ <strong>User Role:</strong> Should be "admin"</li>
              <li>✅ <strong>Firestore User:</strong> Should show your user document with role="admin"</li>
              <li>✅ <strong>Vendors:</strong> Should list all registered vendors</li>
              <li>❌ <strong>Errors:</strong> Should be empty (no errors)</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="glass-card p-6 bg-yellow-500/10 border border-yellow-500/30">
            <h2 className="text-xl font-bold mb-4">If Something is Wrong</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-yellow-300">If "Auth User" is null:</p>
                <p className="text-gray-300">You're not logged in. Go to /login with admin credentials</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-300">If "Admin Check" is FALSE:</p>
                <p className="text-gray-300">Your email doesn't match the admin email. Check lib/auth.ts</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-300">If "Firestore User" is null:</p>
                <p className="text-gray-300">Admin document doesn't exist in Firestore. Follow ADMIN_SETUP_INSTRUCTIONS.md</p>
              </div>
              <div>
                <p className="font-semibold text-yellow-300">If "Vendors" shows permission error:</p>
                <p className="text-gray-300">Firestore rules are blocking access. Update rules using FIREBASE_RULES.md</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
