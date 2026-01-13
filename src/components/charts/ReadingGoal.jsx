"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function ReadingGoal({ current, target }) {
  const data = [
    { name: "Read", value: current },
    { name: "Remaining", value: Math.max(0, target - current) },
  ];

  // Colors: Primary (Orange) vs Muted (Gray)
  const COLORS = ["#c05621", "#e2e8f0"];
  const percentage = Math.round((current / target) * 100);

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold font-serif mb-2">
        2026 Reading Challenge
      </h3>

      <div className="h-48 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">{percentage}%</span>
          <span className="text-xs text-muted-foreground">
            {current} / {target} Books
          </span>
        </div>
      </div>
    </div>
  );
}
