import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import {
  calculateNetCashFlow,
  calculateSavingsRate,
  aggregateCategories,
} from "@/lib/calculations";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "monthly"; // "daily", "weekly", "monthly", "yearly", "custom"
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (period === "daily") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (period === "weekly") {
      const day = now.getDay() || 7;
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day + 1, 0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    } else if (period === "yearly") {
      startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else if (period === "custom" && startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
      if (endDateParam.length <= 10) {
        endDate.setHours(23, 59, 59, 999);
      }
    } else {
      // Default monthly
      startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        transactionDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { category: true },
      orderBy: { transactionDate: "desc" },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    for (const t of transactions) {
      if (t.type === "INCOME") totalIncome += t.amount;
      if (t.type === "EXPENSE") totalExpense += t.amount;
    }

    const netCashFlow = calculateNetCashFlow(totalIncome, totalExpense);
    const savingsRate = calculateSavingsRate(totalIncome, totalExpense);
    const categoryBreakdown = aggregateCategories(transactions as any, "EXPENSE");
    const incomeCategoryBreakdown = aggregateCategories(transactions as any, "INCOME");

    return NextResponse.json({
      success: true,
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalIncome,
      totalExpense,
      netCashFlow,
      savingsRate,
      transactionCount: transactions.length,
      categoryBreakdown,
      incomeCategoryBreakdown,
      transactions,
    });
  } catch (error) {
    console.error("Reports GET error:", error);
    return NextResponse.json(
      { error: "Gagal memproses data laporan." },
      { status: 500 }
    );
  }
}
