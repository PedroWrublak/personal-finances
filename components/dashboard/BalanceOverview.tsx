import { balanceSummary } from "@/lib/mock-data";

const fmt = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const metrics = [
  {
    label: "Saldo atual",
    value: balanceSummary.currentBalance,
    color: "text-gray-900",
  },
  {
    label: "Receitas do mês",
    value: balanceSummary.monthlyIncome,
    color: "text-emerald-700",
  },
  {
    label: "Despesas do mês",
    value: balanceSummary.monthlyExpenses,
    color: "text-red-600",
  },
  {
    label: "Saldo líquido",
    value: balanceSummary.netBalance,
    color: "text-gray-900",
  },
];

export default function BalanceOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map(({ label, value, color }) => (
        <div
          key={label}
          className="bg-gray-100 rounded-xl px-4 py-4"
        >
          <p className="text-xs text-gray-500 mb-1.5">{label}</p>
          <p className={`text-xl font-medium ${color}`}>{fmt(value)}</p>
        </div>
      ))}
    </div>
  );
}