"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#c05621", "#ed8936", "#f6ad55", "#fbd38d", "#feebc8"];

export default function GenrePieChart({ data }) {
  // data format: [{name: 'Sci-Fi', value: 5}, ...]

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-75">
      <h3 className="text-lg font-bold font-serif mb-4">Genre Breakdown</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
