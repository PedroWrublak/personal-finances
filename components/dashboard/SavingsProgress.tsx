"use client";

import { useFinanceStore } from "@/store/finance";
import { useMemo } from "react";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function SavingsProgress() {
  const savingsGoals = useFinanceStore((s) => s.savingsGoals);
  const transactions = useFinanceStore((s) => s.transactions);

  const savedByGoal = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "savings")
      .forEach((t) => {
        map[t.categoryId] = (map[t.categoryId] ?? 0) + t.amount;
      });
    return map;
  }, [transactions]);

  const totalSaved = useMemo(
    () => transactions.filter((t) => t.type === "savings").reduce((a, t) => a + t.amount, 0),
    [transactions]
  );

  const totalTarget = savingsGoals.reduce((a, g) => a + g.target, 0);
  const leftover = useMemo(() => {
    const income   = transactions.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
    const expenses = transactions.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    const savings  = transactions.filter((t) => t.type === "savings").reduce((a, t) => a + t.amount, 0);
    return income - expenses - savings;
  }, [transactions]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Poupança</p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>Total poupado: <span className="text-blue-600 font-medium">{fmt(totalSaved)}</span></span>
          {totalTarget > 0 && (
            <span>Meta total: <span className="text-gray-600 font-medium">{fmt(totalTarget)}</span></span>
          )}
        </div>
      </div>

      {/* Automatic leftover */}
      <div className="mb-5 bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 font-medium">Sobra automática</p>
          <p className="text-xs text-gray-400 mt-0.5">Receitas − Despesas − Poupança</p>
        </div>
        <p className={`text-sm font-medium ${leftover >= 0 ? "text-emerald-700" : "text-red-600"}`}>
          {fmt(leftover)}
        </p>
      </div>

      {savingsGoals.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          Nenhuma meta de poupança criada ainda.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {savingsGoals.map((goal) => {
            const saved = savedByGoal[goal.id] ?? 0;
            const pct   = Math.min((saved / goal.target) * 100, 100);
            const done  = saved >= goal.target;

            return (
              <div key={goal.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{goal.name}</span>
                    {done && (
                      <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                        concluída
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {fmt(saved)} / {fmt(goal.target)}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all bg-blue-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}