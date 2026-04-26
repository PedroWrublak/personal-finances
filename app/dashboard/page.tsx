
import BalanceOverview from "@/components/dashboard/BalanceOverview";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import IncomeVsExpenses from "@/components/dashboard/IncomeVsExpenses";
import MonthlyExpenses from "@/components/dashboard/MonthlyExpenses";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-medium text-gray-800 mb-6">Visão geral</h1>
      <div className="flex flex-col gap-6">
        <BalanceOverview />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncomeVsExpenses />
          <MonthlyExpenses />
        </div>
        <BudgetProgress />
      </div>
    </main>
  );
}