"use client";

import { useState } from "react";
import type { LeaderboardPlayer } from "./Leaderboard";

interface AdminPlayerManagementProps {
  players: LeaderboardPlayer[];
  onAddPlayer: (name: string) => Promise<void>;
  onRemovePlayer: (playerId: string) => Promise<void>;
  isLoading?: boolean;
}

export function AdminPlayerManagement({
  players,
  onAddPlayer,
  onRemovePlayer,
  isLoading = false,
}: AdminPlayerManagementProps) {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [addedMessage, setAddedMessage] = useState("");

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    await onAddPlayer(newPlayerName);
    setAddedMessage(newPlayerName);
    setNewPlayerName("");
    setTimeout(() => setAddedMessage(""), 2000);
  };

  const handleRemovePlayer = async (playerId: string) => {
    setDeletingId(playerId);
    await onRemovePlayer(playerId);
    setDeletingId(null);
    setConfirmDelete(null);
  };

  return (
    <div className="glass rounded-3xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] font-bold tracking-[0.4em] text-cyan-300/70 mb-2">
            · ROSTER ·
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-300 bg-clip-text text-transparent">
            Players
          </h2>
          <p className="text-white/50 text-sm mt-1">
            {players.length} players in the championship
          </p>
        </div>
      </div>

      <form
        onSubmit={handleAddPlayer}
        className="mb-8 pb-8 border-b border-white/10"
      >
        <label className="block text-[10px] font-bold tracking-[0.3em] text-cyan-300/70 mb-3">
          ADD NEW PLAYER
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Player name"
            className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/40 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !newPlayerName.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
          >
            + Add
          </button>
        </div>
        {addedMessage && (
          <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm animate-slide-up">
            {addedMessage} joined the championship
          </div>
        )}
      </form>

      <div>
        <h3 className="text-[10px] font-bold tracking-[0.3em] text-white/40 mb-4">
          CURRENT ROSTER
        </h3>
        <div className="space-y-2">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-cyan-400/30 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-cyan-500/20">
                  {idx + 1}
                </div>
                <div>
                  <div className="font-bold text-white">{player.name}</div>
                  <div className="text-[10px] tracking-widest text-white/40 mt-0.5">
                    {player.totalPoints} PTS · {player.wins} WINS
                  </div>
                </div>
              </div>

              {confirmDelete === player.id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    disabled={isLoading || deletingId === player.id}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(player.id)}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold rounded-lg transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
