const test = require("node:test");
const assert = require("node:assert");

// Calculation logic tests
function calculateTotalBalance(startingBalance, totalIncome, totalExpense) {
  return startingBalance + totalIncome - totalExpense;
}

function calculateNetCashFlow(totalIncome, totalExpense) {
  return totalIncome - totalExpense;
}

function calculateBudgetStatus(usedAmount, budgetAmount) {
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

  let status = "SAFE";
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

function calculateSavingsRate(totalIncome, totalExpense) {
  if (totalIncome <= 0) return 0;
  const rate = ((totalIncome - totalExpense) / totalIncome) * 100;
  return Math.max(0, Math.round(rate * 10) / 10);
}

test("Financial Calculations: Total Balance calculation with starting balance", () => {
  const startingBalance = 5000000;
  const totalIncome = 10000000;
  const totalExpense = 4500000;

  const balance = calculateTotalBalance(startingBalance, totalIncome, totalExpense);
  assert.strictEqual(balance, 10500000);
});

test("Financial Calculations: Net Cash Flow", () => {
  const totalIncome = 8500000;
  const totalExpense = 3200000;

  const net = calculateNetCashFlow(totalIncome, totalExpense);
  assert.strictEqual(net, 5300000);
});

test("Financial Calculations: Budget Status - Safe condition (< 80%)", () => {
  const budgetAmount = 1000000;
  const usedAmount = 500000;

  const result = calculateBudgetStatus(usedAmount, budgetAmount);
  assert.strictEqual(result.usagePercentage, 50);
  assert.strictEqual(result.remainingAmount, 500000);
  assert.strictEqual(result.status, "SAFE");
});

test("Financial Calculations: Budget Status - Warning condition (>= 80% and < 100%)", () => {
  const budgetAmount = 1000000;
  const usedAmount = 850000;

  const result = calculateBudgetStatus(usedAmount, budgetAmount);
  assert.strictEqual(result.usagePercentage, 85);
  assert.strictEqual(result.remainingAmount, 150000);
  assert.strictEqual(result.status, "WARNING");
});

test("Financial Calculations: Budget Status - Exceeded condition (>= 100%)", () => {
  const budgetAmount = 1000000;
  const usedAmount = 1200000;

  const result = calculateBudgetStatus(usedAmount, budgetAmount);
  assert.strictEqual(result.usagePercentage, 120);
  assert.strictEqual(result.remainingAmount, -200000);
  assert.strictEqual(result.status, "EXCEEDED");
});

test("Financial Calculations: Savings Rate calculation", () => {
  const income = 10000000;
  const expense = 6500000;

  const rate = calculateSavingsRate(income, expense);
  assert.strictEqual(rate, 35); // 35%
});

test("Financial Calculations: Savings Rate when expense > income", () => {
  const income = 5000000;
  const expense = 6000000;

  const rate = calculateSavingsRate(income, expense);
  assert.strictEqual(rate, 0); // floor to 0
});
