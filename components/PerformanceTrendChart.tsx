"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/lib/use-is-mobile";

interface PerformanceTrendChartProps {
  rounds: any[];
  results: any[];
  players: any[];
}

const COLORS = [
  "#fbbf24",
  "#60a5fa",
  "#34d399",
  "#f472b6",
  "#a78bfa",
  "#fb923c",
  "#14b8a6",
  "#f87171",
  "#4ade80",
  "#818cf8",
];

export function PerformanceTrendChart({
  rounds,
  results,
  players,
}: PerformanceTrendChartProps) {
  const isMobile = useIsMobile();

  // Build cumulative points chart for a proper championship trajectory view
  const sortedRounds = [...rounds].sort((a, b) => a.round_number - b.round_number);
  const totals: Record<string, number> = {};
  players.forEach((p: any) => (totals[p.name] = 0));

  const chartData = sortedRounds.map((round) => {
    const row: any = { roundNumber: round.round_number };
    players.forEach((player: any) => {
      const result = results.find(
        (r: any) => r.round_id === round.id && r.player_id === player.id
      );
      totals[player.name] += result?.points ?? 0;
      row[player.name] = totals[player.name];
    });
    return row;
  });

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-bold tracking-[0.4em] text-emerald-300/70 mb-2">· TRAJECTORY ·</div>
          <h3 className="text-lg sm:text-xl font-black text-white truncate">
            Cumulative Points Over Season
          </h3>
        </div>
        <div className="text-[10px] tracking-widest text-white/30 shrink-0">
          {sortedRounds.length} ROUNDS
        </div>
      </div>
      <div className="w-full h-72 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: isMobile ? 8 : 20, left: -16, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="roundNumber"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: isMobile ? 10 : 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              interval="preserveStartEnd"
              minTickGap={isMobile ? 24 : 16}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: isMobile ? 10 : 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              width={32}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{
                fontSize: isMobile ? 10 : 12,
                paddingTop: 8,
                lineHeight: "1.6",
              }}
              iconType="circle"
              iconSize={isMobile ? 8 : 10}
            />
            {players.map((player: any, index: number) => (
              <Line
                key={player.id}
                type="monotone"
                dataKey={player.name}
                stroke={COLORS[index % COLORS.length]}
                dot={false}
                isAnimationActive
                animationDuration={1800}
                strokeWidth={isMobile ? 2 : 2.5}
                activeDot={{ r: isMobile ? 4 : 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
