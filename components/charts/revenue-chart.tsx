"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueData } from "@/data/mock";

export function RevenueChart() {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(24 95% 53%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(24 95% 53%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(187 94% 43%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(187 94% 43%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#71717a" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#71717a" }}
            tickFormatter={(value) => `$${value / 1000}k`}
            dx={-8}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e4e4e7",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="secondary"
            stroke="hsl(187 94% 43%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSecondary)"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(24 95% 53%)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
