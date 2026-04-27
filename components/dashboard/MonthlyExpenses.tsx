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

import { useMemo } from "react";
import { useFinanceStore } from "@/store/finance";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const COLORS = [
  "#1D9E75",
  "#378ADD",
  "#E24B4A",
  "#888780",
  "#EF9F27",
  "#D4537E",
];

function getLast6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("pt-BR", { month: "short" }).replace(".", ""),
      start: new Date(d.getFullYear(), d.getMonth(), 1).toISOString(),
      end: new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
        23,
        59,
        59,
      ).toISOString(),
    });
  }
  return months;
}

export default function MonthlyExpenses() {
  const budgets = useFinanceStore((s) => s.budgets);
  const transactions = useFinanceStore((s) => s.transactions);

  const { data, categories } = useMemo(() => {
    const months = getLast6Months();
    const cats = budgets.map((b) => ({ id: b.id, name: b.name }));

    const chartData = months.map(({ label, start, end }) => {
      const row: Record<string, string | number> = { month: label };
      const inRange = transactions.filter(
        (t) => t.type === "expense" && t.date >= start && t.date <= end,
      );
      cats.forEach(({ id, name }) => {
        row[name] = inRange
          .filter((t) => t.categoryId === id)
          .reduce((a, t) => a + t.amount, 0);
      });
      return row;
    });

    return { data: chartData, categories: cats };
  }, [budgets, transactions]);

  if (categories.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
          Gastos por categoria
        </p>
        <p className="text-sm text-gray-400 text-center py-6">
          Nenhuma categoria criada ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Gastos por categoria
      </p>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
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
            {categories.map(({ name }, i) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
