"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useFinanceStore } from "@/store/finance";
import { useMemo } from "react";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function getLast6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString("pt-BR", { month: "short" }).replace(".", ""),
      start: new Date(d.getFullYear(), d.getMonth(), 1).toISOString(),
      end:   new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59).toISOString(),
    });
  }
  return months;
}

export default function IncomeVsExpenses() {
  const transactions = useFinanceStore((s) => s.transactions);

  const data = useMemo(() => {
    return getLast6Months().map(({ label, start, end }) => {
      const inRange = transactions.filter((t) => t.date >= start && t.date <= end);
      return {
        month:    label,
        income:   inRange.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0),
        expenses: inRange.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0),
        savings:  inRange.filter((t) => t.type === "savings").reduce((a, t) => a + t.amount, 0),
      };
    });
  }, [transactions]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Receitas vs despesas vs poupança
      </p>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%">
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
              tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => fmt(value as number)}
              contentStyle={{ borderRadius: "10px", border: "0.5px solid #e5e7eb", fontSize: "12px" }}
            />
            <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
            <Bar dataKey="income"   name="Receitas" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Despesas" fill="#E24B4A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="savings"  name="Poupança" fill="#378ADD" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}