export const balanceSummary = {
  currentBalance: 8420,
  monthlyIncome: 6500,
  monthlyExpenses: 4230,
  netBalance: 2270,
};

export const months = ["Nov", "Dez", "Jan", "Fev", "Mar", "Abr"];

export const incomeVsExpensesData = months.map((month, i) => ({
  month,
  income:   [6200, 6500, 6500, 6800, 6500, 6500][i],
  expenses: [4100, 5200, 3900, 4400, 3800, 4230][i],
}));

export const monthlyExpensesByCategoryData = months.map((month, i) => ({
  month,
  Alimentação: [900, 1100, 780, 850, 800, 820][i],
  Transporte:  [350, 380, 300, 360, 380, 390][i],
  Lazer:       [300, 600, 250, 400, 280, 520][i],
  Moradia:     [1800, 1800, 1800, 1800, 1800, 1800][i],
}));

export const categoryColors: Record<string, string> = {
  Alimentação: "#1D9E75",   
  Transporte:  "#378ADD",
  Lazer:       "#E24B4A",
  Moradia:     "#888780",
};

export const budgetItems = [
  { name: "Alimentação", spent: 820,  limit: 1000 },
  { name: "Transporte",  spent: 390,  limit: 400  },
  { name: "Lazer",       spent: 520,  limit: 400  },
  { name: "Moradia",     spent: 1800, limit: 1800 },
  { name: "Saúde",       spent: 180,  limit: 300  },
];