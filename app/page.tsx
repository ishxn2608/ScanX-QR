"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import ScanXLogo from "@/components/ScanXLogo";

// ── Flat 2D SVG icon components ──────────────────────────────────────────────

function IconQR({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
      <path strokeLinecap="round" d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z" />
    </svg>
  );
}

function IconShield({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 3v5c0 5-3.5 9.3-7 10.5C8.5 19.3 5 15 5 10V5l7-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconChart({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-5 4 3 4-6" />
    </svg>
  );
}

function IconScan({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V5a2 2 0 012-2h2M16 3h2a2 2 0 012 2v2M20 17v2a2 2 0 01-2 2h-2M8 21H6a2 2 0 01-2-2v-2" />
      <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconCard({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path strokeLinecap="round" d="M2 10h20" />
      <path strokeLinecap="round" d="M6 15h4" />
    </svg>
  );
}

function IconLock({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path strokeLinecap="round" d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

function IconBolt({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L4.5 13.5H12L11 22l8.5-11.5H12L13 2z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  // Removed mouse tracking for better performance

  return (
    <div className="relative min-h-screen overflow-hidden gradient-bg">
      {/* Simplified background orbs - no mouse tracking */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl"
          style={{ top: "5%", left: "5%" }}
        />
        <div
          className="absolute w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-3xl"
          style={{ bottom: "5%", right: "5%" }}
        />
      </div>

      {/* ── Hero ── */}
      <div className="relative z-10 container mx-auto px-4 pt-36 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Brand block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
            className="flex flex-col items-center mb-8"
          >
            <ScanXLogo iconSize={64} fontSize={32} className="mb-3" />
            <p className="text-xs text-gray-500 tracking-[0.3em] uppercase mt-1">Scan. Verify. Trust.</p>
          </motion.div>

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Trusted by 10,000+ verified vendors</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
          >
            <span className="block text-white">Secure Your</span>
            <span className="block gradient-text">Payments with</span>
            <span className="block text-white">Smart QR Verification</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            ScanX QR prevents payment fraud with real-time merchant verification.
            Scan, verify, and pay with complete confidence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/scan" className="btn-neon">
              <span>Scan QR Code</span>
            </Link>
            <Link
              href="/register-simple"
              className="px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              Register as Vendor
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Simplified floating card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 relative"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Simplified QR mockup */}
                <div className="glass-card p-6 relative">
                  <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center p-4">
                    <IconQR className="w-full h-full text-blue-600" />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="badge-verified inline-flex">
                      <IconCheck className="w-4 h-4" />
                      <span>ScanX Verified</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <ScanXLogo variant="icon" iconSize={28} />
                    <span className="text-xs font-semibold text-blue-400 tracking-widest uppercase">ScanX QR</span>
                  </div>
                  <h3 className="text-3xl font-bold">Real-time Verification</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Every QR code is dynamically generated and verified against our secure database in milliseconds.
                  </p>
                  <div className="space-y-3 pt-1">
                    <FeatureItem icon={<IconLock className="w-4 h-4 text-blue-400" />} text="End-to-end encryption" />
                    <FeatureItem icon={<IconBolt className="w-4 h-4 text-purple-400" />} text="Instant verification" />
                    <FeatureItem icon={<IconShield className="w-4 h-4 text-cyan-400" />} text="Fraud prevention" />
                    <FeatureItem icon={<IconChart className="w-4 h-4 text-green-400" />} text="Real-time analytics" />
                  </div>
                </div>
              </div>
            </div>

            {/* Simplified floating badges */}
            <div className="absolute -top-6 -left-6 glass-card px-4 py-3">
              <div className="flex items-center gap-2">
                <IconCheck className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-white">Verified</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card px-4 py-3">
              <div className="flex items-center gap-2">
                <IconLock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">Secure</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Features ── */}
      <div className="relative z-10 container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-blue-400 tracking-widest uppercase font-semibold mb-3">Why ScanX QR?</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Built for <span className="gradient-text">Security & Speed</span>
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto">Minimal, fast, and bulletproof — designed for modern fintech</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            delay={0.1}
            icon={<IconScan className="w-7 h-7 text-blue-400" />}
            color="blue"
            title="Instant Verification"
            description="Verify merchant authenticity in milliseconds with our real-time database lookup"
          />
          <FeatureCard
            delay={0.2}
            icon={<IconShield className="w-7 h-7 text-purple-400" />}
            color="purple"
            title="Bank-Grade Security"
            description="Military-grade encryption protects every transaction and merchant identity"
          />
          <FeatureCard
            delay={0.3}
            icon={<IconChart className="w-7 h-7 text-cyan-400" />}
            color="cyan"
            title="Admin Analytics"
            description="Track payments, manage vendors, and monitor your platform with powerful insights"
          />
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs text-purple-400 tracking-widest uppercase font-semibold mb-3">Simple Process</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            How <span className="gradient-text">ScanX QR</span> Works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { step: "01", icon: <IconScan className="w-8 h-8 text-blue-400" />, title: "Scan", desc: "Customer scans the vendor's ScanX QR code" },
            { step: "02", icon: <IconShield className="w-8 h-8 text-purple-400" />, title: "Verify", desc: "ScanX instantly verifies the merchant identity" },
            { step: "03", icon: <IconCard className="w-8 h-8 text-cyan-400" />, title: "Trust & Pay", desc: "Pay with confidence knowing the merchant is verified" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card p-8 text-center relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-bold tracking-widest">
                {item.step}
              </div>
              <div className="flex justify-center mb-4 mt-2">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 to-purple-600/8 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <ScanXLogo iconSize={40} fontSize={20} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to <span className="gradient-text">Get Started?</span>
            </h2>
            <p className="text-base text-gray-400 mb-10 max-w-xl mx-auto">
              Join thousands of verified vendors on ScanX QR today. Free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register-simple" className="btn-neon">
                <span>Create Free Account</span>
              </Link>
              <Link href="/scan" className="px-8 py-4 rounded-full font-semibold border border-white/20 hover:bg-white/10 transition-all duration-300">
                Try Scanning
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ── */}
      <div className="relative z-10 border-t border-white/5 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <ScanXLogo iconSize={28} fontSize={15} />
              <span className="text-gray-600 text-xs ml-1">— Scan. Verify. Trust.</span>
            </div>
            <p className="text-sm text-gray-600">© 2026 ScanX QR. All rights reserved.</p>
          </div>
          
          {/* Developer Credit */}
          <div className="text-center pt-4 border-t border-white/5">
            <p className="text-sm text-gray-500">
              Developed by{" "}
              <a 
                href="https://www.linkedin.com/in/ishan-acharya-939112295/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors font-semibold inline-flex items-center gap-1"
              >
                Ishan Acharya
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-gray-300 text-sm">{text}</span>
    </div>
  );
}

function FeatureCard({
  delay,
  icon,
  color,
  title,
  description,
}: {
  delay: number;
  icon: React.ReactNode;
  color: "blue" | "purple" | "cyan";
  title: string;
  description: string;
}) {
  const bg = {
    blue: "bg-blue-500/10 border-blue-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
    cyan: "bg-cyan-500/10 border-cyan-500/20",
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      className="glass-card-hover p-8"
    >
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${bg}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
