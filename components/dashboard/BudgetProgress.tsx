"use client";

import { useFinanceStore } from "@/Store/finance";
import { useMemo } from "react";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function getBarColor(pct: number) {
  if (pct >= 100) return "bg-red-500";
  if (pct >= 90) return "bg-amber-400";
  return "bg-emerald-500";
}

function getTextColor(pct: number) {
  if (pct >= 100) return "text-red-600";
  if (pct >= 90) return "text-amber-600";
  return "text-gray-500";
}

export default function BudgetProgress() {
  const budgets = useFinanceStore((s) => s.budgets);
  const transactions = useFinanceStore((s) => s.transactions);

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

  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense" && t.date >= start && t.date <= end)
      .forEach((t) => {
        map[t.categoryId] = (map[t.categoryId] ?? 0) + t.amount;
      });
    return map;
  }, [transactions, start, end]);

  const monthName = now.toLocaleString("pt-BR", { month: "long" });

  if (budgets.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
          Progresso do orçamento
        </p>
        <p className="text-sm text-gray-400 text-center py-6">
          Nenhuma categoria de orçamento criada ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-5">
        Progresso do orçamento — {monthName}
      </p>
      <div className="flex flex-col gap-4">
        {budgets.map((budget) => {
          const spent = spentByCategory[budget.id] ?? 0;
          const pct = Math.min((spent / budget.limit) * 100, 100);
          const over = spent > budget.limit;

          return (
            <div key={budget.id}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-gray-700">{budget.name}</span>
                <div className="flex items-center gap-2">
                  {over && (
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                      acima do limite
                    </span>
                  )}
                  <span className={`text-xs ${getTextColor(pct)}`}>
                    {fmt(spent)} / {fmt(budget.limit)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getBarColor(pct)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
