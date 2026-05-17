"use client";

import { useState } from "react";
import type { LeaderboardPlayer } from "./Leaderboard";

interface AdminRoundFormProps {
  players: LeaderboardPlayer[];
  nextRoundNumber: number;
  onSubmit: (roundNumber: number, results: any[]) => Promise<void>;
  isLoading?: boolean;
}

type RankValue = number | "DNF" | null;

export function AdminRoundForm({
  players,
  nextRoundNumber,
  onSubmit,
  isLoading = false,
}: AdminRoundFormProps) {
  const [roundNumber, setRoundNumber] = useState(nextRoundNumber);
  const [results, setResults] = useState<Record<string, RankValue>>(
    players.reduce(
      (acc, player) => ({
        ...acc,
        [player.id]: null,
      }),
      {}
    )
  );
  const [submitted, setSubmitted] = useState(false);

  const handleRankChange = (playerId: string, value: RankValue) => {
    setResults((prev) => ({
      ...prev,
      [playerId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasAllRanks = players.every((p) => results[p.id] !== null);
    if (!hasAllRanks) {
      alert("Please set a position or mark DNF for every player");
      return;
    }

    // Validate that no two players have the same finishing position
    const ranks = players
      .map((p) => results[p.id])
      .filter((v): v is number => typeof v === "number");
    const uniqueRanks = new Set(ranks);
    if (uniqueRanks.size !== ranks.length) {
      alert("Two players have the same position — please fix duplicates");
      return;
    }

    const resultData = players.map((player) => {
      const value = results[player.id];
      const isDNF = value === "DNF";
      return {
        playerId: player.id,
        rank: isDNF ? null : (value as number),
        dnf: isDNF,
      };
    });

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
        {players.map((player) => {
          const value = results[player.id];
          const isDNF = value === "DNF";
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${
                isDNF
                  ? "bg-rose-500/5 border-rose-500/30"
                  : "bg-white/[0.02] border-white/5 hover:border-amber-400/30 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                    isDNF
                      ? "bg-gradient-to-br from-rose-400 to-rose-700 text-rose-950"
                      : "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-amber-950"
                  }`}
                >
                  {player.name.charAt(0)}
                </div>
                <div>
                  <span className="text-white font-bold block">{player.name}</span>
                  {isDNF && (
                    <span className="text-[10px] font-bold tracking-[0.25em] text-rose-300/80">
                      DID NOT PARTICIPATE · 0 PTS
                    </span>
                  )}
                </div>
              </div>
              <select
                value={value === null ? "" : value.toString()}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") handleRankChange(player.id, null);
                  else if (v === "DNF") handleRankChange(player.id, "DNF");
                  else handleRankChange(player.id, parseInt(v));
                }}
                className={`px-4 py-2 border rounded-xl font-bold focus:outline-none focus:ring-2 cursor-pointer ${
                  isDNF
                    ? "bg-rose-500/10 border-rose-500/40 text-rose-200 focus:ring-rose-400/60"
                    : "bg-black/40 border-white/10 text-white focus:ring-amber-400/60"
                }`}
                required
              >
                <option value="">Position</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((rank) => (
                  <option key={rank} value={rank}>
                    P{rank}
                  </option>
                ))}
                <option value="DNF">DNF</option>
              </select>
            </div>
          );
        })}
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
