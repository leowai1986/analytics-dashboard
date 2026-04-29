"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { trafficSourceData } from "@/data/mock";

const COLORS = [
  "hsl(24 95% 53%)",
  "hsl(187 94% 43%)",
  "hsl(239 84% 67%)",
  "hsl(84 81% 44%)",
  "hsl(330 81% 60%)",
];

export function TrafficChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={trafficSourceData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {trafficSourceData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e4e4e7",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            formatter={(value: number) => [`${value}%`, "Share"]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
