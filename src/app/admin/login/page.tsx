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
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="hero" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div 
        className="hero-skills-panel" 
        style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 10, background: "var(--panel)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-summary" style={{ borderBottom: "none", marginBottom: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="brand" style={{ borderRadius: "50%", marginBottom: "1rem" }}>NECP</div>
          <h2 style={{ textAlign: "center", margin: 0, color: "var(--ink)" }}>Admin Access</h2>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p style={{ color: "var(--brick)", fontSize: "0.8rem", marginBottom: "1rem" }}>{error}</p>}
          <button type="submit" className="button primary" style={{ width: "100%" }}>Login</button>
        </form>
      </motion.div>
    </main>
  );
}
