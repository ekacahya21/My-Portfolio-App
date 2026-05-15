"use client";

import "../../admin.css";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface-container-lowest border border-outline-variant p-10 shadow-2xl space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-flex w-16 h-16 rounded-full bg-primary items-center justify-center text-on-primary mb-2">
              <span className="material-symbols-outlined text-3xl">lock_open</span>
            </div>
            <div>
              <p className="font-label-caps text-[10px] text-secondary tracking-[0.2em] mb-1">SECURE ACCESS</p>
              <h1 className="font-display text-4xl font-bold text-primary tracking-tight">Admin Console</h1>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="font-label-caps text-[9px] text-on-surface-variant tracking-widest uppercase">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  className="w-full bg-surface-container-low border border-outline-variant p-4 font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-[9px] text-on-surface-variant tracking-widest uppercase">PASSWORD</label>
                <input 
                  type="password" 
                  className="w-full bg-surface-container-low border border-outline-variant p-4 font-body-md text-sm focus:outline-none focus:border-primary transition-colors"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-error text-xs font-semibold bg-error/5 p-3 border border-error/10">
                <span className="material-symbols-outlined text-sm">warning</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-primary text-on-primary py-4 rounded font-label-caps text-[11px] uppercase tracking-[0.15em] hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              {isLoggingIn ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Authenticating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">login</span>
                  Secure Login
                </>
              )}
            </button>
          </form>

          <div className="pt-6 text-center border-t border-outline-variant">
            <p className="font-label-caps text-[9px] text-on-surface-variant opacity-60">
              © 2026 NANANG CAHYA — PRIVATE REPOSITORY
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
