"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthChange, logoutUser, getUserRole } from "@/lib/auth";
import ScanXLogo from "@/components/ScanXLogo";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      if (authUser) {
        const role = await getUserRole(authUser.uid);
        setUserRole(role);
      } else {
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  const isAuthPage = pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password");

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`navbar-blur transition-all duration-300 ${
        scrolled ? "py-4 shadow-lg shadow-black/20" : "py-6"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <ScanXLogo iconSize={36} fontSize={20} />
          </Link>

          {/* Desktop Navigation — absolutely centred */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {!isAuthPage && (
              <>
                <NavLink href="/" active={pathname === "/"}>
                  Home
                </NavLink>
                {user && (
                  <>
                    {userRole === "admin" ? (
                      <NavLink href="/admin/dashboard" active={pathname.startsWith("/admin")}>
                        Dashboard
                      </NavLink>
                    ) : userRole === "vendor" ? (
                      <NavLink href="/vendor" active={pathname.startsWith("/vendor")}>
                        Dashboard
                      </NavLink>
                    ) : userRole === "customer" ? (
                      <NavLink href="/scan" active={pathname === "/scan"}>
                        Scan & Pay
                      </NavLink>
                    ) : null}
                  </>
                )}
                {!user && (
                  <NavLink href="/scan" active={pathname === "/scan"}>
                    Scan & Pay
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </Link>
                <Link href="/register-simple" className="btn-neon">
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-white/10"
            >
              <div className="flex flex-col gap-4">
                <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </MobileNavLink>
                {user ? (
                  <>
                    <MobileNavLink
                      href={userRole === "admin" ? "/admin/dashboard" : userRole === "vendor" ? "/vendor" : "/scan"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {userRole === "admin" ? "Dashboard" : userRole === "vendor" ? "Dashboard" : "Scan & Pay"}
                    </MobileNavLink>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="text-left px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink href="/scan" onClick={() => setMobileMenuOpen(false)}>
                      Scan & Pay
                    </MobileNavLink>
                    <MobileNavLink href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </MobileNavLink>
                    <MobileNavLink href="/register-simple" onClick={() => setMobileMenuOpen(false)}>
                      Sign Up
                    </MobileNavLink>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-lg transition-colors ${
        active ? "text-white" : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute inset-0 bg-white/10 rounded-lg -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
    >
      {children}
    </Link>
  );
}
