"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminRoundForm } from "@/components/AdminRoundForm";
import { AdminPlayerManagement } from "@/components/AdminPlayerManagement";
import { SeasonControl } from "@/components/SeasonControl";
import type { LeaderboardPlayer } from "@/components/Leaderboard";

interface SeasonState {
  isFinished: boolean;
  winnerId: string | null;
  winnerName: string | null;
  declaredAt: string | null;
}

const EMPTY_SEASON: SeasonState = {
  isFinished: false,
  winnerId: null,
  winnerName: null,
  declaredAt: null,
};

export function AdminDashboardClient() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [standings, setStandings] = useState<LeaderboardPlayer[]>([]);
  const [season, setSeason] = useState<SeasonState>(EMPTY_SEASON);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [roundCount, setRoundCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if authenticated by trying to fetch - the session cookie should work
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playersRes, roundsRes, standingsRes, seasonRes] = await Promise.all([
        fetch("/api/players"),
        fetch("/api/rounds"),
        fetch("/api/standings"),
        fetch("/api/season"),
      ]);

      if (!playersRes.ok || !roundsRes.ok) throw new Error("Failed to fetch");

      const playersData = await playersRes.json();
      const roundsData = await roundsRes.json();

      setPlayers(playersData);
      setRoundCount(roundsData.rounds?.length || 0);

      if (standingsRes.ok) {
        setStandings(await standingsRes.json());
      }
      if (seasonRes.ok) {
        setSeason(await seasonRes.json());
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnauthorized = (response: Response) => {
    if (response.status === 401) {
      router.push("/admin");
      return true;
    }
    return false;
  };

  const handleAddRound = async (roundNumber: number, resultData: any[]) => {
    try {
      const response = await fetch("/api/rounds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundNumber, results: resultData }),
      });

      if (handleUnauthorized(response)) return;
      if (!response.ok) throw new Error("Failed to add round");

      setRoundCount((prev) => prev + 1);
      await fetchData();
    } catch (err) {
      console.error("Error adding round:", err);
      setError("Failed to add round");
    }
  };

  const handleAddPlayer = async (name: string) => {
    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (handleUnauthorized(response)) return;
      if (!response.ok) throw new Error("Failed to add player");

      await fetchData();
    } catch (err) {
      console.error("Error adding player:", err);
      setError("Failed to add player");
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      const response = await fetch(`/api/players/${playerId}`, {
        method: "DELETE",
      });

      if (handleUnauthorized(response)) return;
      if (!response.ok) throw new Error("Failed to remove player");

      await fetchData();
    } catch (err) {
      console.error("Error removing player:", err);
      setError("Failed to remove player");
    }
  };

  if (isLoading) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center relative">
        <div className="grid-overlay" />
        <div className="text-center">
          <p className="text-white/50 tracking-widest text-sm">LOADING…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aurora-bg min-h-screen relative">
      <div className="grid-overlay" />

      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center font-black text-amber-950 text-sm shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              AD
            </div>
            <div>
              <h1 className="text-2xl font-black text-shimmer leading-none">
                ADMIN CENTER
              </h1>
              <p className="text-[10px] text-white/40 tracking-[0.3em] mt-1 font-mono">
                {players.length} PLAYERS · {roundCount} ROUNDS PLAYED
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-ghost text-sm">
              ← <span className="hidden sm:inline">Leaderboard</span>
            </Link>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                // Hard redirect that replaces history → back button won't return here
                window.location.replace("/");
              }}
              className="px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-200 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 animate-slide-up">
            {error}
          </div>
        )}

        <div className="mb-6 animate-slide-up">
          <SeasonControl
            players={standings.length > 0 ? standings : players}
            winnerId={season.winnerId}
            winnerName={season.winnerName}
            declaredAt={season.declaredAt}
            onChange={fetchData}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-slide-up" style={{ animationDelay: "60ms" }}>
            {season.isFinished ? (
              <div className="glass rounded-3xl p-10 text-center ring-1 ring-amber-400/30">
                <div className="text-[10px] font-bold tracking-[0.4em] text-amber-300/70 mb-3">
                  · SEASON CLOSED ·
                </div>
                <h3 className="text-2xl font-black text-shimmer mb-3">
                  Round entry is locked
                </h3>
                <p className="text-white/60 text-sm max-w-sm mx-auto">
                  {season.winnerName ?? "The champion"} has been declared. Withdraw
                  the champion above to reopen the season and add more rounds.
                </p>
              </div>
            ) : players.length > 0 ? (
              <AdminRoundForm
                players={players}
                nextRoundNumber={roundCount + 1}
                onSubmit={handleAddRound}
              />
            ) : (
              <div className="glass rounded-3xl p-10 text-center">
                <p className="text-white/60">
                  Add players first before entering round results.
                </p>
              </div>
            )}
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "120ms" }}>
            <AdminPlayerManagement
              players={players}
              onAddPlayer={handleAddPlayer}
              onRemovePlayer={handleRemovePlayer}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
