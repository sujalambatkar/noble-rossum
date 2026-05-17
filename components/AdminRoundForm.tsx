"use client";

import { useState } from "react";
import type { LeaderboardPlayer } from "./Leaderboard";

interface AdminRoundFormProps {
  players: LeaderboardPlayer[];
  nextRoundNumber: number;
  onSubmit: (roundNumber: number, results: any[]) => Promise<void>;
  isLoading?: boolean;
}

export function AdminRoundForm({
  players,
  nextRoundNumber,
  onSubmit,
  isLoading = false,
}: AdminRoundFormProps) {
  const [roundNumber, setRoundNumber] = useState(nextRoundNumber);
  const [results, setResults] = useState<Record<string, number | null>>(
    players.reduce(
      (acc, player) => ({
        ...acc,
        [player.id]: null,
      }),
      {}
    )
  );
  const [submitted, setSubmitted] = useState(false);

  const handleRankChange = (playerId: string, rank: number | null) => {
    setResults((prev) => ({
      ...prev,
      [playerId]: rank,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all players have a rank
    const hasAllRanks = players.every((p) => results[p.id] !== null);
    if (!hasAllRanks) {
      alert("Please select a rank for all players");
      return;
    }

    const resultData = players.map((player) => ({
      playerId: player.id,
      rank: results[player.id],
      dnf: false,
    }));

    await onSubmit(roundNumber, resultData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    setResults(
      players.reduce(
        (acc, player) => ({
          ...acc,
          [player.id]: null,
        }),
        {}
      )
    );
    setRoundNumber(roundNumber + 1);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] font-bold tracking-[0.4em] text-amber-300/70 mb-2">
            · NEW ROUND ·
          </div>
          <h2 className="text-3xl font-black text-shimmer">Match Results</h2>
          <p className="text-white/50 text-sm mt-1">Set the finishing position for each player</p>
        </div>
      </div>

      <div className="mb-8 p-5 glass-gold rounded-2xl">
        <label className="block text-[10px] font-bold tracking-[0.3em] text-amber-300 mb-3">
          ROUND NUMBER
        </label>
        <input
          type="number"
          value={roundNumber}
          onChange={(e) => setRoundNumber(parseInt(e.target.value))}
          className="w-full px-4 py-3 bg-black/40 border border-amber-400/30 rounded-xl text-white text-2xl font-black stat-number focus:outline-none focus:ring-2 focus:ring-amber-400/60"
          min="1"
          required
        />
      </div>

      <div className="space-y-2 mb-8">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-400/30 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center font-black text-amber-950">
                {player.name.charAt(0)}
              </div>
              <span className="text-white font-bold">{player.name}</span>
            </div>
            <select
              value={results[player.id] || ""}
              onChange={(e) =>
                handleRankChange(player.id, e.target.value ? parseInt(e.target.value) : null)
              }
              className="px-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-amber-400/60 cursor-pointer"
              required
            >
              <option value="">Position</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((rank) => (
                <option key={rank} value={rank}>
                  P{rank}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-gold w-full py-4 text-base disabled:opacity-40"
      >
        {isLoading ? "SUBMITTING…" : "SUBMIT ROUND"}
      </button>

      {submitted && (
        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 font-semibold text-center animate-slide-up">
          Round #{roundNumber - 1} added successfully
        </div>
      )}
    </form>
  );
}
