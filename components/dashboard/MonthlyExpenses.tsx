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
import { monthlyExpensesByCategoryData, categoryColors } from "@/lib/mock-data";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const categories = Object.keys(categoryColors);

export default function MonthlyExpenses() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Gastos por categoria
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={monthlyExpensesByCategoryData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip
            formatter={(value) => fmt(value as number)}
            contentStyle={{
              borderRadius: "10px",
              border: "0.5px solid #e5e7eb",
              fontSize: "12px",
            }}
          />
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
          />
          {categories.map((cat) => (
            <Line
              key={cat}
              type="monotone"
              dataKey={cat}
              stroke={categoryColors[cat]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}