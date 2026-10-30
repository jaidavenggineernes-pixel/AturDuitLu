import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "INCOME" or "EXPENSE"
    const categoryId = searchParams.get("categoryId");
    const paymentMethod = searchParams.get("paymentMethod");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const sortBy = searchParams.get("sortBy") || "date_desc"; // date_desc, date_asc, amount_desc, amount_asc
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const where: any = {
      userId: user.id,
    };

    if (type && type !== "ALL") {
      where.type = type.toUpperCase();
    }

    if (categoryId && categoryId !== "ALL") {
      where.categoryId = categoryId;
    }

    if (paymentMethod && paymentMethod !== "ALL") {
      where.paymentMethod = paymentMethod;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) {
        where.transactionDate.gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of the day if date string only
        const end = new Date(endDate);
        if (endDate.length <= 10) {
          end.setHours(23, 59, 59, 999);
        }
        where.transactionDate.lte = end;
      }
    }

    let orderBy: any = { transactionDate: "desc" };
    if (sortBy === "date_asc") orderBy = { transactionDate: "asc" };
    if (sortBy === "amount_desc") orderBy = { amount: "desc" };
    if (sortBy === "amount_asc") orderBy = { amount: "asc" };

    const totalCount = await prisma.transaction.count({ where });

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Transactions GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data transaksi." },
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
    const {
      name,
      amount,
      type,
      categoryId,
      transactionDate,
      paymentMethod,
      notes,
    } = body;

    if (!name || amount === undefined || !type || !categoryId) {
      return NextResponse.json(
        { error: "Nama transaksi, nominal, jenis, dan kategori wajib diisi." },
        { status: 400 }
      );
    }

    const parsedAmount = Math.abs(parseFloat(amount));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Nominal transaksi harus lebih besar dari 0." },
        { status: 400 }
      );
    }

    const date = transactionDate ? new Date(transactionDate) : new Date();

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        name: name.trim(),
        amount: parsedAmount,
        type: type.toUpperCase(),
        categoryId,
        transactionDate: date,
        paymentMethod: paymentMethod || "Cash",
        notes: notes ? notes.trim() : null,
      },
      include: {
        category: true,
      },
    });

    // Check budget alert if expense
    if (type.toUpperCase() === "EXPENSE") {
      try {
        const activeBudgets = await prisma.budget.findMany({
          where: {
            userId: user.id,
            startDate: { lte: date },
            endDate: { gte: date },
            OR: [{ categoryId }, { categoryId: null }],
          },
          include: { category: true },
        });

        for (const budget of activeBudgets) {
          // Calculate spent in this budget window
          const spentAgg = await prisma.transaction.aggregate({
            where: {
              userId: user.id,
              type: "EXPENSE",
              transactionDate: {
                gte: budget.startDate,
                lte: budget.endDate,
              },
              ...(budget.categoryId ? { categoryId: budget.categoryId } : {}),
            },
            _sum: { amount: true },
          });

          const totalSpent = spentAgg._sum.amount || 0;
          const targetName = budget.category?.name || "Keseluruhan";

          if (totalSpent >= budget.amount) {
            await prisma.notification.create({
              data: {
                userId: user.id,
                title: `🚨 Anggaran ${targetName} Terlampaui!`,
                message: `Total pengeluaran (${new Intl.NumberFormat("id-ID").format(
                  totalSpent
                )}) telah melebihi batas anggaran (${new Intl.NumberFormat("id-ID").format(
                  budget.amount
                )}).`,
                type: "BUDGET_EXCEEDED",
                isRead: false,
              },
            });
          } else if (totalSpent >= budget.amount * 0.8) {
            await prisma.notification.create({
              data: {
                userId: user.id,
                title: `⚠️ Anggaran ${targetName} Hampir Habis`,
                message: `Pengeluaran telah mencapai ${Math.round(
                  (totalSpent / budget.amount) * 100
                )}% dari batas anggaran.`,
                type: "BUDGET_WARNING",
                isRead: false,
              },
            });
          }
        }
      } catch (err) {
        console.error("Budget check error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("Transactions POST error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan transaksi." },
      { status: 500 }
    );
  }
}
