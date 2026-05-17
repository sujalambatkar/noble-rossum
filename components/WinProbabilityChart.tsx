"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AnalyticsData } from "@/lib/analytics";
import { useIsMobile, abbreviateName } from "@/lib/use-is-mobile";

interface WinProbabilityChartProps {
  data: AnalyticsData[];
}

const COLORS = ["#fbbf24", "#60a5fa", "#34d399", "#f472b6", "#a78bfa", "#fb923c", "#14b8a6", "#f87171", "#4ade80", "#818cf8"];

export function WinProbabilityChart({ data }: WinProbabilityChartProps) {
  const isMobile = useIsMobile();
  const chartData = data
    .map((player) => ({
      name: player.name,
      probability: Math.round(player.winProbability * 100) / 100,
    }))
    .sort((a, b) => b.probability - a.probability);

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-5">
        <div className="text-[10px] font-bold tracking-[0.4em] text-purple-300/70 mb-2">· FORECAST ·</div>
        <h3 className="text-lg sm:text-xl font-black text-white">Championship Win Probability</h3>
      </div>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 4, left: -12, bottom: isMobile ? 36 : 50 }}
          >
            <defs>
              {COLORS.map((c, i) => (
                <linearGradient key={i} id={`winGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={1} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.4} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="name"
              angle={isMobile ? -55 : -35}
              textAnchor="end"
              height={isMobile ? 60 : 70}
              interval={0}
              tickFormatter={(v) => (isMobile ? abbreviateName(v, 6) : v)}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: isMobile ? 10 : 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: isMobile ? 10 : 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              unit="%"
              width={36}
            />
            <Tooltip
              cursor={{ fill: "rgba(168,85,247,0.08)" }}
              formatter={(value) => [`${value}%`, "Win chance"]}
            />
            <Bar dataKey="probability" radius={[8, 8, 0, 0]} animationDuration={1200}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={`url(#winGrad${index % COLORS.length})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
