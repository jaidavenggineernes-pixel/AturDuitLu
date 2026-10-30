export interface TransactionItem {
  id: string;
  name: string;
  amount: number;
  type: "INCOME" | "EXPENSE" | string;
  transactionDate: Date | string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
}

export interface BudgetStatus {
  budgetAmount: number;
  usedAmount: number;
  remainingAmount: number;
  usagePercentage: number;
  status: "SAFE" | "WARNING" | "EXCEEDED";
}

/**
 * Total Balance = Starting Balance + Total Income - Total Expense
 */
export function calculateTotalBalance(
  startingBalance: number,
  totalIncome: number,
  totalExpense: number
): number {
  return startingBalance + totalIncome - totalExpense;
}

/**
 * Net Cash Flow = Total Income - Total Expense
 */
export function calculateNetCashFlow(totalIncome: number, totalExpense: number): number {
  return totalIncome - totalExpense;
}

/**
 * Budget Usage % = (Total Eligible Expenses / Budget Amount) * 100
 * Remaining Budget = Budget Amount - Total Eligible Expenses
 */
export function calculateBudgetStatus(usedAmount: number, budgetAmount: number): BudgetStatus {
  if (budgetAmount <= 0) {
    return {
      budgetAmount,
      usedAmount,
      remainingAmount: -usedAmount,
      usagePercentage: 100,
      status: usedAmount > 0 ? "EXCEEDED" : "SAFE",
    };
  }

  const usagePercentage = Math.round((usedAmount / budgetAmount) * 100);
  const remainingAmount = budgetAmount - usedAmount;

  let status: "SAFE" | "WARNING" | "EXCEEDED" = "SAFE";
  if (usagePercentage >= 100) {
    status = "EXCEEDED";
  } else if (usagePercentage >= 80) {
    status = "WARNING";
  }

  return {
    budgetAmount,
    usedAmount,
    remainingAmount,
    usagePercentage,
    status,
  };
}

/**
 * Savings Rate (%) = ((Total Income - Total Expense) / Total Income) * 100
 */
export function calculateSavingsRate(totalIncome: number, totalExpense: number): number {
  if (totalIncome <= 0) return 0;
  const rate = ((totalIncome - totalExpense) / totalIncome) * 100;
  return Math.max(0, Math.round(rate * 10) / 10);
}

/**
 * Aggregate category spendings
 */
export function aggregateCategories(transactions: TransactionItem[], type: "EXPENSE" | "INCOME" = "EXPENSE") {
  const filtered = transactions.filter((t) => t.type === type);
  const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  const categoryMap = new Map<
    string,
    { id: string; name: string; icon: string; color: string; amount: number; count: number }
  >();

  for (const tx of filtered) {
    const catId = tx.category?.id || tx.categoryId || "uncategorized";
    const catName = tx.category?.name || "Lainnya";
    const catIcon = tx.category?.icon || "MoreHorizontal";
    const catColor = tx.category?.color || "#64748B";

    const current = categoryMap.get(catId) || {
      id: catId,
      name: catName,
      icon: catIcon,
      color: catColor,
      amount: 0,
      count: 0,
    };

    current.amount += tx.amount;
    current.count += 1;
    categoryMap.set(catId, current);
  }

  const result = Array.from(categoryMap.values()).map((item) => ({
    ...item,
    percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0,
  }));

  // Sort descending by amount
  return result.sort((a, b) => b.amount - a.amount);
}
