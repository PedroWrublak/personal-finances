"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { incomeVsExpensesData } from "@/lib/mock-data";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function IncomeVsExpenses() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Receitas vs despesas
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={incomeVsExpensesData} barCategoryGap="30%">
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
          <Bar dataKey="income" name="Receitas" fill="#1D9E75" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Despesas" fill="#E24B4A" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}