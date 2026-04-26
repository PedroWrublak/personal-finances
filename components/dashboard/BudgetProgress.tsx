import { budgetItems } from "@/lib/mock-data";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function getBarColor(pct: number): string {
  if (pct >= 100) return "bg-red-500";
  if (pct >= 90) return "bg-amber-400";
  return "bg-emerald-500";
}

function getTextColor(pct: number): string {
  if (pct >= 100) return "text-red-600";
  if (pct >= 90) return "text-amber-600";
  return "text-gray-500";
}

export default function BudgetProgress() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-5">
        Progresso do orçamento — abril
      </p>
      <div className="flex flex-col gap-4">
        {budgetItems.map(({ name, spent, limit }) => {
          const pct = Math.min((spent / limit) * 100, 100);
          const overBudget = spent > limit;

          return (
            <div key={name}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-gray-700">{name}</span>
                <div className="flex items-center gap-2">
                  {overBudget && (
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                      acima do limite
                    </span>
                  )}
                  <span className={`text-xs ${getTextColor(pct)}`}>
                    {fmt(spent)} / {fmt(limit)}
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