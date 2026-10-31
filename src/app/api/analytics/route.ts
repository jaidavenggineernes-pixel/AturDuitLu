import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import {
  calculateTotalBalance,
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
    const period = searchParams.get("period") || "monthly"; // "daily", "weekly", "monthly", "yearly"

    const now = new Date();
    const userTz = user.settings?.timezone || "Asia/Jakarta";
    const tzFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: userTz,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const tzParts = tzFormatter.formatToParts(now);
    const tzMap: Record<string, string> = {};
    for (const p of tzParts) tzMap[p.type] = p.value;
    const currentYear = parseInt(tzMap.year, 10);
    const currentMonth = parseInt(tzMap.month, 10) - 1;
    const currentDate = parseInt(tzMap.day, 10);

    // User Settings starting balance
    const startingBalance = user.settings?.startingBalance || 0;

    // All-time totals
    const allTimeAgg = await prisma.transaction.groupBy({
      by: ["type"],
      where: { userId: user.id },
      _sum: { amount: true },
    });

    let allTimeIncome = 0;
    let allTimeExpense = 0;
    for (const item of allTimeAgg) {
      if (item.type === "INCOME") allTimeIncome = item._sum.amount || 0;
      if (item.type === "EXPENSE") allTimeExpense = item._sum.amount || 0;
    }

    const currentTotalBalance = calculateTotalBalance(
      startingBalance,
      allTimeIncome,
      allTimeExpense
    );

    // Date range boundaries for Daily, Weekly, Monthly, Yearly
    // 1. Daily
    const startOfToday = new Date(currentYear, currentMonth, currentDate, 0, 0, 0, 0);
    const endOfToday = new Date(currentYear, currentMonth, currentDate, 23, 59, 59, 999);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);
    const endOfYesterday = new Date(endOfToday);
    endOfYesterday.setDate(endOfToday.getDate() - 1);

    // 2. Weekly (Monday to Sunday)
    const dayOfWeek = now.getDay() || 7;
    const startOfWeek = new Date(currentYear, currentMonth, currentDate - dayOfWeek + 1, 0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfPrevWeek = new Date(startOfWeek);
    startOfPrevWeek.setDate(startOfWeek.getDate() - 7);
    const endOfPrevWeek = new Date(startOfWeek);
    endOfPrevWeek.setMilliseconds(-1);

    // 3. Monthly
    const startOfMonth = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
    const startOfPrevMonth = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
    const endOfPrevMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

    // 4. Yearly
    const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    const startOfPrevYear = new Date(currentYear - 1, 0, 1, 0, 0, 0, 0);
    const endOfPrevYear = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);

    const currentUserId = user.id;

    // Helper for period aggregation
    async function getPeriodStats(startDate: Date, endDate: Date) {
      const agg = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
          userId: currentUserId,
          transactionDate: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
      });

      let income = 0;
      let expense = 0;
      for (const item of agg) {
        if (item.type === "INCOME") income = item._sum.amount || 0;
        if (item.type === "EXPENSE") expense = item._sum.amount || 0;
      }

      return {
        income,
        expense,
        netCashFlow: calculateNetCashFlow(income, expense),
        savingsRate: calculateSavingsRate(income, expense),
      };
    }

    const todayStats = await getPeriodStats(startOfToday, endOfToday);
    const yesterdayStats = await getPeriodStats(startOfYesterday, endOfYesterday);

    const weekStats = await getPeriodStats(startOfWeek, endOfWeek);
    const prevWeekStats = await getPeriodStats(startOfPrevWeek, endOfPrevWeek);

    const monthStats = await getPeriodStats(startOfMonth, endOfMonth);
    const prevMonthStats = await getPeriodStats(startOfPrevMonth, endOfPrevMonth);

    const yearStats = await getPeriodStats(startOfYear, endOfYear);
    const prevYearStats = await getPeriodStats(startOfPrevYear, endOfPrevYear);

    // 7-day daily activity for weekly view
    const last7Days: any[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayAgg = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
          userId: user.id,
          transactionDate: { gte: dayStart, lte: dayEnd },
        },
        _sum: { amount: true },
      });

      let inc = 0;
      let exp = 0;
      for (const item of dayAgg) {
        if (item.type === "INCOME") inc = item._sum.amount || 0;
        if (item.type === "EXPENSE") exp = item._sum.amount || 0;
      }

      const dayName = new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(d);
      const dateFormatted = `${d.getDate()}/${d.getMonth() + 1}`;

      last7Days.push({
        dayName,
        dateFormatted,
        date: d.toISOString().split("T")[0],
        income: inc,
        expense: exp,
        net: inc - exp,
        dayNum: d.getDate(),
      });
    }

    // 12-month trend for yearly view
    const monthly12Trends: any[] = [];
    for (let m = 0; m < 12; m++) {
      const mStart = new Date(currentYear, m, 1, 0, 0, 0, 0);
      const mEnd = new Date(currentYear, m + 1, 0, 23, 59, 59, 999);

      const mAgg = await prisma.transaction.groupBy({
        by: ["type"],
        where: {
          userId: user.id,
          transactionDate: { gte: mStart, lte: mEnd },
        },
        _sum: { amount: true },
      });

      let mInc = 0;
      let mExp = 0;
      for (const item of mAgg) {
        if (item.type === "INCOME") mInc = item._sum.amount || 0;
        if (item.type === "EXPENSE") mExp = item._sum.amount || 0;
      }

      const monthName = new Intl.DateTimeFormat("id-ID", { month: "short" }).format(mStart);
      monthly12Trends.push({
        monthIndex: m,
        monthName,
        income: mInc,
        expense: mExp,
        net: mInc - mExp,
      });
    }

    // Current month transactions with category for breakdown
    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        transactionDate: { gte: startOfMonth, lte: endOfMonth },
      },
      include: { category: true },
    });

    const categoryBreakdown = aggregateCategories(currentMonthTransactions as any, "EXPENSE");
    const highestSpendingCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

    // Average daily expense in current month
    const daysPassedInMonth = Math.max(1, currentDate);
    const averageDailyExpense = Math.round(monthStats.expense / daysPassedInMonth);

    // Monthly expense delta percentage vs previous month
    let monthlyExpenseChangePct = 0;
    if (prevMonthStats.expense > 0) {
      monthlyExpenseChangePct = Math.round(
        ((monthStats.expense - prevMonthStats.expense) / prevMonthStats.expense) * 100
      );
    }

    // Savings Goals total
    const totalSavingsCurrent = await prisma.savingsGoal.aggregate({
      where: { userId: user.id },
      _sum: { currentAmount: true },
    });

    // Smart Insight Summary
    const insights: string[] = [];
    if (highestSpendingCategory) {
      insights.push(
        `Kategori pengeluaran terbesar bulan ini adalah ${highestSpendingCategory.name} sebesar Rp ${new Intl.NumberFormat("id-ID").format(highestSpendingCategory.amount)} (${highestSpendingCategory.percentage}% dari total pengeluaran).`
      );
    }
    if (prevMonthStats.expense > 0) {
      if (monthStats.expense > prevMonthStats.expense) {
        insights.push(
          `Pengeluaran bulan ini meningkat ${monthlyExpenseChangePct}% dibandingkan bulan lalu. Periksa pos pengeluaran yang tidak mendesak.`
        );
      } else {
        insights.push(
          `Bagus! Pengeluaran bulan ini lebih hemat ${Math.abs(monthlyExpenseChangePct)}% dibandingkan bulan lalu.`
        );
      }
    }
    if (monthStats.savingsRate >= 20) {
      insights.push(
        `Tingkat tabungan (Savings Rate) kamu bulan ini mencapai ${monthStats.savingsRate}%, berada di atas standar ideal kesehatan finansial (20%).`
      );
    } else if (monthStats.income > 0) {
      insights.push(
        `Tingkat tabungan bulan ini adalah ${monthStats.savingsRate}%. Cobalah alokasikan minimal 20% penghasilan ke pos tabungan.`
      );
    }

    return NextResponse.json({
      success: true,
      currentTotalBalance,
      startingBalance,
      totalIncomeAllTime: allTimeIncome,
      totalExpenseAllTime: allTimeExpense,
      totalSavingsCurrent: totalSavingsCurrent._sum.currentAmount || 0,
      periods: {
        daily: {
          today: todayStats,
          yesterday: yesterdayStats,
        },
        weekly: {
          thisWeek: weekStats,
          prevWeek: prevWeekStats,
          last7Days,
        },
        monthly: {
          thisMonth: monthStats,
          prevMonth: prevMonthStats,
          changePercentage: monthlyExpenseChangePct,
        },
        yearly: {
          thisYear: yearStats,
          prevYear: prevYearStats,
          monthlyTrends: monthly12Trends,
        },
      },
      categoryBreakdown,
      highestSpendingCategory,
      averageDailyExpense,
      insights,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      { error: "Gagal memproses data analisis finansial." },
      { status: 500 }
    );
  }
}
