"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AnalyticsData } from "@/lib/analytics";

interface PointsGapChartProps {
  data: AnalyticsData[];
}

export function PointsGapChart({ data }: PointsGapChartProps) {
  const chartData = data.map((player) => ({
    name: player.name,
    pointsToFirst: player.pointsToFirst,
    currentPoints: player.totalPoints,
  }));

  const colors = ["#fbbf24", "#60a5fa", "#34d399", "#f472b6", "#a78bfa", "#fb923c", "#14b8a6", "#f87171", "#4ade80", "#818cf8"];

  return (
    <div className="w-full">
      <div className="mb-5">
        <div className="text-[10px] font-bold tracking-[0.4em] text-rose-300/70 mb-2">· GAP TO LEADER ·</div>
        <h3 className="text-xl font-black text-white">Points Behind #1</h3>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 50 }}>
            <defs>
              {colors.map((c, i) => (
                <linearGradient key={i} id={`gapGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c} stopOpacity={1} />
                  <stop offset="100%" stopColor={c} stopOpacity={0.4} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              height={70}
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(250,204,21,0.08)" }}
              formatter={(value) => [value, "Points behind"]}
            />
            <Bar dataKey="pointsToFirst" radius={[10, 10, 0, 0]} animationDuration={1200}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={`url(#gapGrad${index % colors.length})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
