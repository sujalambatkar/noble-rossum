"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Incorrect password");
        setPassword("");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="aurora-bg min-h-screen flex items-center justify-center px-4 relative">
      <div className="grid-overlay" />

      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="text-[10px] font-bold tracking-[0.4em] text-amber-400/70 mb-4">
            · RESTRICTED ACCESS ·
          </div>
          <h1 className="text-4xl font-black text-shimmer mb-2">
            ADMIN ACCESS
          </h1>
          <p className="text-white/50 text-sm tracking-widest">
            CHAMPIONSHIP CONTROL CENTER
          </p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <label className="block text-[10px] font-bold tracking-[0.3em] text-white/40 mb-3">
              PASSWORD
            </label>
            <div className="relative mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400/40 transition-all"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm animate-slide-up">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="btn-gold w-full py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:filter-none"
            >
              {isLoading ? "AUTHENTICATING…" : "ENTER COMMAND CENTER →"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link
              href="/"
              className="text-white/40 hover:text-amber-300 text-sm transition-colors"
            >
              ← Back to Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
