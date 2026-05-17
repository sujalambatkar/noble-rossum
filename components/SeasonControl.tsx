"use client";

import { useState } from "react";
import type { LeaderboardPlayer } from "./Leaderboard";

interface SeasonControlProps {
  players: LeaderboardPlayer[];
  winnerId: string | null;
  winnerName: string | null;
  declaredAt: string | null;
  onChange: () => Promise<void> | void;
}

export function SeasonControl({
  players,
  winnerId,
  winnerName,
  declaredAt,
  onChange,
}: SeasonControlProps) {
  const isFinished = !!winnerId;
  const topByPoints = players[0]?.id ?? "";
  const [selectedId, setSelectedId] = useState<string>(topByPoints);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const declare = async () => {
    if (!selectedId) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/season", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: selectedId }),
      });
      if (!res.ok) throw new Error("Failed to declare winner");
      await onChange();
    } catch (e: any) {
      setError(e.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };

  const withdraw = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/season", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to withdraw winner");
      await onChange();
    } catch (e: any) {
      setError(e.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`glass rounded-3xl p-6 sm:p-8 ${
        isFinished ? "ring-1 ring-amber-400/40" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[10px] font-bold tracking-[0.4em] text-amber-300/70 mb-2">
            · SEASON CONTROL ·
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-shimmer">
            {isFinished ? "Champion Declared" : "Declare Champion"}
          </h2>
          <p className="text-white/50 text-sm mt-1">
            {isFinished
              ? "Season is closed. New rounds cannot be added until the champion is withdrawn."
              : "Crown a champion to officially close the season."}
          </p>
        </div>
      </div>

      {isFinished ? (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-400/30 shadow-[0_0_30px_rgba(250,204,21,0.15)]">
            <div className="text-[10px] font-bold tracking-[0.3em] text-amber-300/80 mb-2">
              CURRENT CHAMPION
            </div>
            <div className="text-3xl sm:text-4xl font-black text-shimmer">
              {winnerName ?? "—"}
            </div>
            {declaredAt && (
              <div className="text-[10px] tracking-widest text-amber-200/60 mt-2">
                CROWNED{" "}
                {new Date(declaredAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={withdraw}
            disabled={busy}
            className="w-full px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-200 font-bold rounded-xl transition-all disabled:opacity-40"
          >
            {busy ? "WITHDRAWING…" : "WITHDRAW CHAMPION · REOPEN SEASON"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block text-[10px] font-bold tracking-[0.3em] text-amber-300/70">
            SELECT CHAMPION
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            disabled={busy || players.length === 0}
            className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/60 cursor-pointer"
          >
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.totalPoints} pts · {p.wins} wins
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={declare}
            disabled={busy || !selectedId}
            className="btn-gold w-full py-3 disabled:opacity-40"
          >
            {busy ? "DECLARING…" : "DECLARE CHAMPION · CLOSE SEASON"}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
