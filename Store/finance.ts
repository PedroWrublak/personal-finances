import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BudgetItem {
  id: string;
  name: string;
  limit: number;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  date: string;
  note?: string;
  type: "income" | "expense";
}

interface FinanceStore {
  budgets: BudgetItem[];
  transactions: Transaction[];
  addBudget: (item: Omit<BudgetItem, "id">) => void;
  updateBudget: (id: string, item: Omit<BudgetItem, "id">) => void;
  deleteBudget: (id: string) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
}

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set) => ({
      budgets: [
        { id: "1", name: "Alimentação", limit: 1000 },
        { id: "2", name: "Transporte",  limit: 400  },
        { id: "3", name: "Lazer",       limit: 400  },
        { id: "4", name: "Moradia",     limit: 1800 },
        { id: "5", name: "Saúde",       limit: 300  },
      ],
      transactions: [],
      addBudget: (item) =>
        set((s) => ({
          budgets: [...s.budgets, { ...item, id: Date.now().toString() }],
        })),
      updateBudget: (id, item) =>
        set((s) => ({
          budgets: s.budgets.map((b) => (b.id === id ? { ...b, ...item } : b)),
        })),
      deleteBudget: (id) =>
        set((s) => ({
          budgets: s.budgets.filter((b) => b.id !== id),
          transactions: s.transactions.filter((t) => t.categoryId !== id),
        })),
      addTransaction: (t) =>
        set((s) => ({
          transactions: [
            { ...t, id: Date.now().toString() },
            ...s.transactions,
          ],
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),
    }),
    { name: "personal-finances" }
  )
);