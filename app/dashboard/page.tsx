import BalanceOverview from "@/components/dashboard/BalanceOverview";
import IncomeVsExpenses from "@/components/dashboard/IncomeVsExpenses";
import MonthlyExpenses from "@/components/dashboard/MonthlyExpenses";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import SavingsProgress from "@/components/dashboard/SavingsProgress";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">Visão geral</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {new Date().toLocaleString("pt-BR", { month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <BalanceOverview />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <IncomeVsExpenses />
          <MonthlyExpenses />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BudgetProgress />
          <SavingsProgress />
        </div>
      </div>
    </main>
  );
}