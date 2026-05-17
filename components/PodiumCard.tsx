"use client";

import { LeaderboardPlayer } from "./Leaderboard";

interface PodiumCardProps {
  players: LeaderboardPlayer[];
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return <>{initials.toUpperCase()}</>;
}

export function PodiumCard({ players }: PodiumCardProps) {
  const [first, second, third] = players;

  if (!first) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end max-w-5xl mx-auto">
      {/* 2nd Place — mobile: middle | desktop: left */}
      {second ? (
        <PodiumTile
          place={2}
          player={second}
          padY="py-8 md:py-10"
          accent="from-slate-200 via-slate-300 to-slate-500"
          ring="ring-slate-300/40"
          borderGlow="rgba(203, 213, 225, 0.35)"
          delay="120ms"
          order="order-2 md:order-1"
        />
      ) : (
        <div className="order-2 md:order-1" />
      )}

      {/* 1st Place — mobile: top | desktop: center, taller */}
      <PodiumTile
        place={1}
        player={first}
        padY="py-10 md:py-14"
        accent="from-amber-200 via-yellow-300 to-amber-500"
        ring="ring-yellow-400/50"
        borderGlow="rgba(250, 204, 21, 0.5)"
        delay="0ms"
        order="order-1 md:order-2"
        champion
      />

      {/* 3rd Place — mobile: bottom | desktop: right */}
      {third ? (
        <PodiumTile
          place={3}
          player={third}
          padY="py-6 md:py-8"
          accent="from-orange-300 via-amber-500 to-orange-700"
          ring="ring-orange-400/40"
          borderGlow="rgba(251, 146, 60, 0.35)"
          delay="220ms"
          order="order-3 md:order-3"
        />
      ) : (
        <div className="order-3 md:order-3" />
      )}
    </div>
  );
}

interface TileProps {
  place: 1 | 2 | 3;
  player: LeaderboardPlayer;
  padY: string;
  accent: string;
  ring: string;
  borderGlow: string;
  delay: string;
  order: string;
  champion?: boolean;
}

function PodiumTile({
  place,
  player,
  padY,
  accent,
  ring,
  borderGlow,
  delay,
  order,
  champion,
}: TileProps) {
  const placeLabel = place === 1 ? "1ST" : place === 2 ? "2ND" : "3RD";
  const placeBig = `#${place}`;
  const placeBigSize = champion ? "text-8xl md:text-9xl" : "text-7xl md:text-8xl";
  const pointSize = champion ? "text-6xl md:text-7xl" : "text-5xl md:text-6xl";
  const avatarSize = champion ? "w-20 h-20 text-2xl" : "w-16 h-16 text-xl";

  return (
    <div
      className={`${order} animate-slide-up`}
      style={{ animationDelay: delay }}
    >
      <div className={`relative ${champion ? "champion-halo" : ""} rounded-3xl`}>
        <div
          className={`glass card-lift relative rounded-3xl px-6 ${padY} flex flex-col items-center gap-5 ring-1 ${ring} overflow-hidden`}
          style={{
            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.08),
              0 30px 80px -30px ${borderGlow}
            `,
          }}
        >
          {/* Decorative inner glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${borderGlow}, transparent 70%)`,
            }}
          />

          {/* Place ribbon */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="text-[11px] font-black tracking-[0.4em] text-white/50">
              {placeLabel} PLACE
            </div>
            <div
              className={`stat-number ${placeBigSize} font-black bg-gradient-to-b ${accent} bg-clip-text text-transparent leading-none ${champion ? "animate-float" : ""}`}
              style={{ animationDelay: delay }}
            >
              {placeBig}
            </div>
            {champion && (
              <div className="mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 text-[10px] font-black tracking-[0.3em] shadow-lg shadow-amber-500/50">
                CHAMPION
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="relative z-10">
            <div
              className={`${avatarSize} rounded-full bg-gradient-to-br ${accent} flex items-center justify-center font-black text-black/80 shadow-2xl ring-4 ring-white/10`}
            >
              <Initials name={player.name} />
            </div>
          </div>

          {/* Name + stats */}
          <div className="relative z-10 text-center w-full">
            <div className="text-lg md:text-xl font-black text-white truncate mb-3">
              {player.name}
            </div>

            <div
              className={`stat-number ${pointSize} font-black bg-gradient-to-b ${accent} bg-clip-text text-transparent leading-none animate-count-up`}
              style={{ animationDelay: delay }}
            >
              {player.totalPoints.toLocaleString()}
            </div>
            <div className="text-[10px] font-bold tracking-[0.3em] text-white/40 mt-2">
              POINTS
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="stat-number text-base font-bold text-white">
                  {player.wins}
                </div>
                <div className="text-[9px] font-bold tracking-widest text-white/40">
                  WINS
                </div>
              </div>
              <div>
                <div className="stat-number text-base font-bold text-white">
                  {player.avgPointsPerRound.toFixed(1)}
                </div>
                <div className="text-[9px] font-bold tracking-widest text-white/40">
                  AVG
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
