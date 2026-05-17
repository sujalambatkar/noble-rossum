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

interface RoundData {
  roundNumber: number;
  playerId: string;
  points: number;
}

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
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-bold tracking-[0.4em] text-emerald-300/70 mb-2">· TRAJECTORY ·</div>
          <h3 className="text-xl font-black text-white">Cumulative Points Over Season</h3>
        </div>
        <div className="text-[10px] tracking-widest text-white/30">
          {sortedRounds.length} ROUNDS
        </div>
      </div>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="roundNumber"
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
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
                strokeWidth={2.5}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
