"use client";

import { useFinanceStore } from "@/Store/finance";
import { useMemo } from "react";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const end = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  ).toISOString();
  return { start, end };
}

export default function BalanceOverview() {
  const transactions = useFinanceStore((s) => s.transactions);

  const { monthlyIncome, monthlyExpenses } = useMemo(() => {
    const { start, end } = getCurrentMonthRange();
    const thisMonth = transactions.filter(
      (t) => t.date >= start && t.date <= end,
    );
    const income = thisMonth
      .filter((t) => t.type === "income")
      .reduce((a, t) => a + t.amount, 0);
    const expenses = thisMonth
      .filter((t) => t.type === "expense")
      .reduce((a, t) => a + t.amount, 0);
    return { monthlyIncome: income, monthlyExpenses: expenses };
  }, [transactions]);

  const netBalance = monthlyIncome - monthlyExpenses;

  const totalBalance = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((a, t) => a + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((a, t) => a + t.amount, 0);
    return income - expenses;
  }, [transactions]);

  const metrics = [
    { label: "Saldo atual", value: totalBalance, color: "text-gray-900" },
    {
      label: "Receitas do mês",
      value: monthlyIncome,
      color: "text-emerald-700",
    },
    { label: "Despesas do mês", value: monthlyExpenses, color: "text-red-600" },
    {
      label: "Saldo líquido",
      value: netBalance,
      color: netBalance >= 0 ? "text-gray-900" : "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map(({ label, value, color }) => (
        <div key={label} className="bg-gray-100 rounded-xl px-4 py-4">
          <p className="text-xs text-gray-500 mb-1.5">{label}</p>
          <p className={`text-xl font-medium ${color}`}>{fmt(value)}</p>
        </div>
      ))}
    </div>
  );
}
