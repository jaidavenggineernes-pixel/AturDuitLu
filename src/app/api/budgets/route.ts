import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { calculateBudgetStatus } from "@/lib/calculations";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budgets = await prisma.budget.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    // Compute active spendings for each budget
    const enrichedBudgets = await Promise.all(
      budgets.map(async (b) => {
        const spentAgg = await prisma.transaction.aggregate({
          where: {
            userId: user.id,
            type: "EXPENSE",
            transactionDate: {
              gte: b.startDate,
              lte: b.endDate,
            },
            ...(b.categoryId ? { categoryId: b.categoryId } : {}),
          },
          _sum: { amount: true },
        });

        const usedAmount = spentAgg._sum.amount || 0;
        const status = calculateBudgetStatus(usedAmount, b.amount);

        return {
          ...b,
          ...status,
        };
      })
    );

    return NextResponse.json({ success: true, budgets: enrichedBudgets });
  } catch (error) {
    console.error("Budgets GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data anggaran." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { categoryId, amount, periodType, startDate, endDate } = body;

    if (!amount || !periodType) {
      return NextResponse.json(
        { error: "Nominal anggaran dan periode wajib diisi." },
        { status: 400 }
      );
    }

    const parsedAmount = Math.abs(parseFloat(amount));

    // Determine dates if not provided
    const now = new Date();
    let start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    let end = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    if (periodType === "DAILY") {
      start = new Date(now.setHours(0, 0, 0, 0));
      end = new Date(now.setHours(23, 59, 59, 999));
    } else if (periodType === "WEEKLY") {
      const day = now.getDay() || 7; // Monday = 1
      start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    }

    const budget = await prisma.budget.create({
      data: {
        userId: user.id,
        categoryId: categoryId === "ALL" || !categoryId ? null : categoryId,
        amount: parsedAmount,
        periodType: periodType.toUpperCase(),
        startDate: start,
        endDate: end,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json({ success: true, budget });
  } catch (error) {
    console.error("Budgets POST error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan anggaran." },
      { status: 500 }
    );
  }
}
