"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [shake, setShake]       = useState(false);

  const login  = useAuthStore((s) => s.login);
  const router = useRouter();

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("All fields required."); triggerShake(); return; }
    setLoading(true); setError("");
    try {
      await login(email, password);   // sets httpOnly cookie + zustand state
      router.replace("/admin");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setError(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">

      {/* Animated grid bg */}
      <div className="absolute inset-0 opacity-100"
           style={{
             backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
             backgroundSize: "40px 40px",
             maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)",
           }} />

      {/* Corner accents */}
      <span className="absolute top-8 left-8 w-14 h-14 border-t border-l border-[#e8ff00] opacity-40" />
      <span className="absolute bottom-8 right-8 w-14 h-14 border-b border-r border-[#e8ff00] opacity-40" />

      {/* Card */}
      <div className={`relative w-105 p-12 bg-[#111] border border-[#222] outline-1 outline-offset-[6px] outline-[#1a1a1a]
                       ${shake ? "animate-shake" : "animate-fade-up"}`}>

        {/* Status bar */}
        <div className="admin-load-bar">
          <div className={`admin-load-bar-fill ${loading ? "loading" : ""}`} />
        </div>

        {/* Scanlines */}
        <div className="absolute inset-0 pointer-events-none"
             style={{
               background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px)",
             }} />

        {/* Heading */}
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#555] mb-3"
           style={{ fontFamily: "'Space Mono', monospace" }}>
          Restricted Access
        </p>
        <h1 className="text-[36px] font-black leading-none tracking-[-0.02em] text-[#f0f0f0] mb-10"
            style={{ fontFamily: "'Syne', sans-serif" }}>
          Admin<br /><span className="text-[#e8ff00]">Portal</span>
        </h1>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#555] mb-2"
                 htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="admin@domain.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="admin-input"
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block text-[10px] tracking-[0.2em] uppercase text-[#555] mb-2"
                 htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="admin-input"
          />
        </div>

        {/* Error */}
        <p className={`text-[11px] text-[#ff4d4d] tracking-wider min-h-5 mt-4
                       flex items-center gap-1.5 ${error ? "visible" : "invisible"}`}>
          <span className="text-[8px]">▲</span> {error}
        </p>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="relative w-full mt-6 py-4 bg-[#e8ff00] text-[#0a0a0a]
                     text-[13px] font-bold tracking-[0.15em] uppercase
                     transition-all duration-150 overflow-hidden
                     hover:bg-[#f5ff4d] hover:-translate-y-px
                     active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {loading ? "Authenticating..." : "Authenticate →"}
        </button>

        {/* Footer */}
        <div className="mt-8 pt-5 border-t border-[#1a1a1a] flex justify-between
                        text-[10px] tracking-wider text-[#333]"
             style={{ fontFamily: "'Space Mono', monospace" }}>
          <span>SYS v2.1.0</span>
          <span>© 2026 ADMIN</span>
        </div>
      </div>
    </div>
  );
}