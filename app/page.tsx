import Link from "next/link";
import { Leaderboard } from "@/components/Leaderboard";
import { PodiumCard } from "@/components/PodiumCard";
import { fetchStandings, fetchRoundCount } from "@/lib/standings";
import { fetchSeasonState, type SeasonState } from "@/lib/season";

export const dynamic = "force-dynamic";

export default async function Home() {
  let standings: Awaited<ReturnType<typeof fetchStandings>> = [];
  let roundCount = 0;
  let season: SeasonState = {
    isFinished: false,
    winnerId: null,
    winnerName: null,
    declaredAt: null,
  };
  try {
    [standings, roundCount, season] = await Promise.all([
      fetchStandings(),
      fetchRoundCount(),
      fetchSeasonState(),
    ]);
  } catch (error) {
    console.error("Home page data fetch failed:", error);
  }
  const leader = standings[0];
  const totalPointsAwarded = standings.reduce((sum, p) => sum + p.totalPoints, 0);
  const totalWins = standings.reduce((sum, p) => sum + p.wins, 0);

  return (
    <div className="aurora-bg min-h-screen relative">
      <div className="grid-overlay" />

      {/* ============== HEADER ============== */}
      <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center font-black text-amber-950 text-lg shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                NR
              </div>
              <div className="absolute -inset-2 bg-yellow-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-shimmer leading-none">
                NOBLE ROSSUM
              </h1>
              <p className="text-[10px] text-white/40 tracking-[0.3em] mt-1 font-mono">
                CRICKET CHAMPIONSHIP · SEASON 1
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/analytics" className="btn-ghost text-xs sm:text-sm">
              Analytics
            </Link>
            <Link href="/admin" className="btn-ghost text-xs sm:text-sm">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* ============== HERO ============== */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center animate-fade-in">
          {season.isFinished ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-300/20 border border-amber-400/40 mb-8 shadow-[0_0_30px_rgba(250,204,21,0.25)]">
              <span className="text-[10px] font-black tracking-[0.3em] text-amber-200">
                SEASON COMPLETE · CHAMPION CROWNED
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8">
              <span className="live-dot" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-white/70">
                LIVE · ROUND {roundCount} COMPLETE
              </span>
            </div>
          )}

          {season.isFinished && season.winnerName ? (
            <>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                <span className="block text-white/70 text-2xl md:text-3xl font-bold mb-3 tracking-widest">
                  CHAMPION
                </span>
                <span className="block text-shimmer">{season.winnerName}</span>
              </h2>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                The season has been declared closed.{" "}
                <span className="font-bold text-gold-gradient">{season.winnerName}</span>{" "}
                is the official champion across {roundCount} rounds.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                <span className="block text-white/90">The Championship</span>
                <span className="block text-shimmer">Standings</span>
              </h2>

              {leader && (
                <p className="text-lg text-white/60 max-w-2xl mx-auto">
                  <span className="font-bold text-gold-gradient">{leader.name}</span> is
                  leading the pack with{" "}
                  <span className="stat-number font-black text-amber-300">
                    {leader.totalPoints.toLocaleString()}
                  </span>{" "}
                  points across {roundCount} rounds.
                </p>
              )}
            </>
          )}
        </div>

        {/* Stats strip */}
        {standings.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-4xl mx-auto">
            <StatChip label="PLAYERS" value={standings.length} accent="text-blue-300" delay="0ms" />
            <StatChip label="ROUNDS" value={roundCount} accent="text-emerald-300" delay="60ms" />
            <StatChip label="POINTS AWARDED" value={totalPointsAwarded.toLocaleString()} accent="text-amber-300" delay="120ms" />
            <StatChip label="MATCH WINS" value={totalWins} accent="text-purple-300" delay="180ms" />
          </div>
        )}
      </section>

      {/* ============== TOP THREE ============== */}
      {standings.length > 0 && (
        <section className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12 animate-fade-in">
            <div className="text-[10px] font-bold tracking-[0.4em] text-amber-400/80 mb-3">
              · TOP THREE ·
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white">
              Champions of the Season
            </h3>
          </div>
          <PodiumCard players={standings} />
        </section>
      )}

      {/* ============== LEADERBOARD ============== */}
      <section className="relative max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[10px] font-bold tracking-[0.4em] text-white/40 mb-2">
              · FULL STANDINGS ·
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white">
              Player Standings
            </h3>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-[10px] font-bold tracking-[0.3em] text-white/40">
              PLAYERS
            </div>
            <div className="stat-number text-3xl font-black text-white">
              {standings.length}
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl overflow-hidden scan-line-container">
          {standings.length > 0 ? (
            <Leaderboard players={standings} />
          ) : (
            <EmptyState />
          )}
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="relative border-t border-white/5 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white/40 text-sm">
            <span className="font-mono tracking-widest text-[10px]">
              POINTS TRACKER · NEXT.JS · SUPABASE
            </span>
          </div>
          <div className="text-white/30 text-[10px] tracking-widest">
            © {new Date().getFullYear()} · NOBLE ROSSUM CHAMPIONSHIP
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatChip({
  label,
  value,
  accent,
  delay,
}: {
  label: string;
  value: string | number;
  accent: string;
  delay: string;
}) {
  return (
    <div
      className="glass card-lift rounded-2xl p-5 text-center animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className={`stat-number text-3xl md:text-4xl font-black ${accent}`}>
        {value}
      </div>
      <div className="text-[10px] font-bold tracking-[0.25em] text-white/40 mt-1">
        {label}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-20 text-center">
      <div className="text-[10px] font-bold tracking-[0.4em] text-amber-400/70 mb-4">
        · NO DATA ·
      </div>
      <h4 className="text-2xl font-black text-white mb-3">
        No matches yet
      </h4>
      <p className="text-white/50 max-w-md mx-auto mb-8">
        No rounds have been recorded. Head to the admin panel to start the
        championship.
      </p>
      <Link href="/admin" className="btn-gold inline-flex">
        Open Admin Panel →
      </Link>
    </div>
  );
}
