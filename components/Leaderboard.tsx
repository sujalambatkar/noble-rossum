"use client";

export interface LeaderboardPlayer {
  id: string;
  name: string;
  totalPoints: number;
  wins: number;
  roundsParticipated: number;
  avgPointsPerRound: number;
}

interface LeaderboardProps {
  players: LeaderboardPlayer[];
}

function getRankBadge(index: number) {
  if (index === 0)
    return {
      label: "1",
      bg: "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600",
      text: "text-amber-950",
      glow: "shadow-[0_0_20px_rgba(250,204,21,0.6)]",
    };
  if (index === 1)
    return {
      label: "2",
      bg: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500",
      text: "text-slate-900",
      glow: "shadow-[0_0_16px_rgba(203,213,225,0.4)]",
    };
  if (index === 2)
    return {
      label: "3",
      bg: "bg-gradient-to-br from-orange-300 via-amber-500 to-orange-700",
      text: "text-orange-950",
      glow: "shadow-[0_0_16px_rgba(251,146,60,0.4)]",
    };
  return {
    label: `${index + 1}`,
    bg: "bg-white/5",
    text: "text-white/60",
    glow: "",
  };
}

function getInitial(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Leaderboard({ players }: LeaderboardProps) {
  const leader = players[0]?.totalPoints ?? 0;
  const maxWins = players.reduce((m, p) => Math.max(m, p.wins), 0);
  const orangeCapHolderId =
    maxWins > 0 ? players.find((p) => p.wins === maxWins)?.id ?? null : null;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-6 py-5 text-left text-[10px] font-bold tracking-[0.25em] text-white/40 w-20">
              POS
            </th>
            <th className="px-2 py-5 text-left text-[10px] font-bold tracking-[0.25em] text-white/40">
              PLAYER
            </th>
            <th className="px-6 py-5 text-right text-[10px] font-bold tracking-[0.25em] text-amber-300/70">
              POINTS
            </th>
            <th className="px-6 py-5 text-right text-[10px] font-bold tracking-[0.25em] text-orange-300/80 hidden sm:table-cell">
              ORANGE CAP
            </th>
            <th className="px-6 py-5 text-right text-[10px] font-bold tracking-[0.25em] text-purple-300/70 hidden md:table-cell">
              AVG/MATCH
            </th>
            <th className="px-6 py-5 text-right text-[10px] font-bold tracking-[0.25em] text-emerald-300/70 hidden lg:table-cell">
              MATCHES
            </th>
            <th className="px-6 py-5 text-right text-[10px] font-bold tracking-[0.25em] text-white/40 hidden lg:table-cell">
              GAP
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            const badge = getRankBadge(index);
            const gap = leader - player.totalPoints;
            const pctOfLeader = leader > 0 ? (player.totalPoints / leader) * 100 : 0;

            return (
              <tr
                key={player.id}
                className="leaderboard-row group border-b border-white/5 last:border-b-0"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <td className="px-6 py-5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base ${badge.bg} ${badge.text} ${badge.glow} ring-1 ring-white/10`}
                  >
                    {badge.label}
                  </div>
                </td>
                <td className="px-2 py-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm text-white shrink-0 ${
                        index === 0
                          ? "bg-gradient-to-br from-amber-400 to-amber-700 ring-2 ring-amber-300/40"
                          : index === 1
                          ? "bg-gradient-to-br from-slate-400 to-slate-700 ring-2 ring-slate-300/30"
                          : index === 2
                          ? "bg-gradient-to-br from-orange-400 to-orange-700 ring-2 ring-orange-300/30"
                          : "bg-gradient-to-br from-gray-700 to-gray-900 ring-1 ring-white/10"
                      }`}
                    >
                      {getInitial(player.name)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-base group-hover:text-amber-200 transition-colors">
                        {player.name}
                      </div>
                      <div className="text-[10px] tracking-widest text-white/30 mt-0.5">
                        {pctOfLeader.toFixed(1)}% OF LEADER
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex flex-col items-end">
                    <span className="stat-number text-3xl font-black text-gold-gradient">
                      {player.totalPoints.toLocaleString()}
                    </span>
                    <div className="w-24 mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
                        style={{ width: `${pctOfLeader}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-right hidden sm:table-cell">
                  {player.id === orangeCapHolderId ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/30 to-amber-500/30 border border-orange-400/50 text-orange-200 font-bold rounded-full text-xs stat-number shadow-[0_0_16px_rgba(251,146,60,0.3)]">
                      <span className="text-orange-300">●</span>
                      <span>{player.wins}</span>
                      <span className="text-[9px] tracking-[0.2em] text-orange-200/80 font-black">CAP</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/10 text-white/60 font-bold rounded-full text-xs stat-number">
                      {player.wins}
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-right hidden md:table-cell">
                  <span className="stat-number text-purple-300 font-bold">
                    {player.avgPointsPerRound.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-5 text-right text-sm text-white/50 stat-number hidden lg:table-cell">
                  {player.roundsParticipated}
                </td>
                <td className="px-6 py-5 text-right hidden lg:table-cell">
                  {gap === 0 ? (
                    <span className="text-[10px] font-black tracking-widest text-amber-400">
                      LEADER
                    </span>
                  ) : (
                    <span className="stat-number text-sm text-white/40">
                      −{gap}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
