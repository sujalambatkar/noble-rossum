"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PointsGapChart } from "@/components/PointsGapChart";
import { WinProbabilityChart } from "@/components/WinProbabilityChart";
import { PerformanceTrendChart } from "@/components/PerformanceTrendChart";
import { calculateAnalytics, AnalyticsData, TOTAL_SEASON_ROUNDS } from "@/lib/analytics";
import type { LeaderboardPlayer } from "@/components/Leaderboard";

export default function Analytics() {
  const [standings, setStandings] = useState<LeaderboardPlayer[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [rounds, setRounds] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [standingsRes, roundsRes] = await Promise.all([
          fetch("/api/standings"),
          fetch("/api/rounds"),
        ]);
        if (!standingsRes.ok || !roundsRes.ok) throw new Error("Failed to fetch");

        const standingsData = await standingsRes.json();
        const roundsData = await roundsRes.json();

        setStandings(standingsData);
        setRounds(roundsData.rounds || []);
        setResults(roundsData.results || []);
        setAnalytics(
          calculateAnalytics(standingsData, roundsData.rounds?.length ?? 0)
        );
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="aurora-bg min-h-screen flex items-center justify-center">
        <div className="grid-overlay" />
        <div className="text-center">
          <p className="text-white/50 tracking-widest text-sm">LOADING ANALYTICS…</p>
        </div>
      </div>
    );
  }

  const leader = standings[0];
  const closestRival = standings[1];
  const gap = leader && closestRival ? leader.totalPoints - closestRival.totalPoints : 0;

  return (
    <div className="aurora-bg min-h-screen relative">
      <div className="grid-overlay" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              AN
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent leading-none">
                ANALYTICS
              </h1>
              <p className="text-[10px] text-white/40 tracking-[0.3em] mt-1 font-mono">
                CHAMPIONSHIP INSIGHTS
              </p>
            </div>
          </Link>
          <Link href="/" className="btn-ghost text-sm">
            ← Leaderboard
          </Link>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {standings.length === 0 ? (
          <div className="glass rounded-3xl p-20 text-center">
            <p className="text-white/60 text-lg mb-6">No data yet to analyze.</p>
            <Link href="/" className="btn-gold">
              Back to Leaderboard
            </Link>
          </div>
        ) : (
          <>
            {/* Hero stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in">
              <HeroStat
                label="LEADER"
                value={leader?.name ?? "—"}
                sub={`${leader?.totalPoints ?? 0} PTS`}
                accent="amber"
              />
              <HeroStat
                label="GAP TO #2"
                value={gap.toString()}
                sub="POINTS"
                accent="rose"
              />
              <HeroStat
                label="ROUNDS"
                value={`${rounds.length} / ${TOTAL_SEASON_ROUNDS}`}
                sub={`${Math.max(0, TOTAL_SEASON_ROUNDS - rounds.length)} TO GO`}
                accent="emerald"
              />
              <HeroStat
                label="PLAYERS"
                value={standings.length.toString()}
                sub="IN CHAMPIONSHIP"
                accent="blue"
              />
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 animate-slide-up">
                <PointsGapChart data={analytics} />
              </div>
              <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
                <WinProbabilityChart data={analytics} />
              </div>
            </div>

            {/* Trend */}
            {rounds.length > 0 && (
              <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <PerformanceTrendChart
                  rounds={rounds}
                  results={results}
                  players={standings}
                />
              </div>
            )}

            {/* Detailed analytics table */}
            <div className="glass rounded-2xl sm:rounded-3xl overflow-hidden animate-slide-up" style={{ animationDelay: "300ms" }}>
              <div className="p-4 sm:p-6 border-b border-white/5">
                <div className="text-[10px] font-bold tracking-[0.4em] text-white/40 mb-2">
                  · DEEP DIVE ·
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Detailed Analytics</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-3 sm:px-6 py-4 text-left text-[10px] font-bold tracking-[0.25em] text-white/40">
                        PLAYER
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-right text-[10px] font-bold tracking-[0.25em] text-amber-300/70">
                        PTS
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-right text-[10px] font-bold tracking-[0.25em] text-purple-300/70 hidden sm:table-cell">
                        AVG/MATCH
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-right text-[10px] font-bold tracking-[0.25em] text-rose-300/70">
                        GAP
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-right text-[10px] font-bold tracking-[0.25em] text-cyan-300/70 hidden md:table-cell">
                        ROUNDS NEEDED
                      </th>
                      <th className="px-3 sm:px-6 py-4 text-right text-[10px] font-bold tracking-[0.25em] text-emerald-300/70">
                        WIN %
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map((player, idx) => (
                      <tr
                        key={player.id}
                        className="leaderboard-row border-b border-white/5 last:border-b-0"
                        style={{ animationDelay: `${idx * 40}ms` }}
                      >
                        <td className="px-3 sm:px-6 py-4">
                          <div className={`font-bold text-sm sm:text-base truncate ${player.isEliminated ? "text-white/40" : "text-white"}`}>
                            {player.name}
                            {player.isEliminated && (
                              <span className="ml-2 text-[9px] font-black tracking-[0.2em] text-rose-400/80">
                                OUT
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/40 sm:hidden mt-0.5 stat-number">
                            avg {player.avgPointsPerRound.toFixed(1)}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-right stat-number text-amber-300 font-black text-base sm:text-lg">
                          {player.totalPoints}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-right stat-number text-white/70 font-bold hidden sm:table-cell">
                          {player.avgPointsPerRound.toFixed(1)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-right stat-number">
                          {player.pointsToFirst === 0 ? (
                            <span className="text-[10px] font-black tracking-widest text-amber-400">
                              LEADER
                            </span>
                          ) : (
                            <span className="text-rose-300 font-semibold text-sm sm:text-base">
                              −{player.pointsToFirst}
                            </span>
                          )}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-right stat-number text-white/60 hidden md:table-cell">
                          {player.roundsNeededToFirst !== null
                            ? player.roundsNeededToFirst
                            : "—"}
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-right">
                          {player.isEliminated ? (
                            <span className="inline-block px-2 sm:px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300/80 font-bold text-xs sm:text-sm stat-number">
                              0.0%
                            </span>
                          ) : (
                            <span className="inline-block px-2 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-xs sm:text-sm stat-number">
                              {player.winProbability.toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function HeroStat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "amber" | "rose" | "emerald" | "blue";
}) {
  const colors = {
    amber: "text-amber-300",
    rose: "text-rose-300",
    emerald: "text-emerald-300",
    blue: "text-blue-300",
  };
  return (
    <div className="glass card-lift rounded-2xl p-4 sm:p-5">
      <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] sm:tracking-[0.3em] text-white/40 mb-1 sm:mb-2">
        {label}
      </div>
      <div className={`text-xl sm:text-2xl md:text-3xl font-black ${colors[accent]} truncate`}>
        {value}
      </div>
      <div className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-white/30 mt-1 truncate">
        {sub}
      </div>
    </div>
  );
}
