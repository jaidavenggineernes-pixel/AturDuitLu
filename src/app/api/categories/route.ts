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

    const where: any = {
      OR: [{ userId: null }, { userId: user.id }],
    };

    if (type && type !== "ALL") {
      where.type = type.toUpperCase();
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    // Also get total spent/earned per category for this user
    const stats = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId: user.id },
      _sum: { amount: true },
      _count: { id: true },
    });

    const statsMap = new Map(
      stats.map((s) => [s.categoryId, { total: s._sum.amount || 0, count: s._count.id }])
    );

    const enriched = categories.map((cat) => ({
      ...cat,
      totalAmount: statsMap.get(cat.id)?.total || 0,
      transactionCount: statsMap.get(cat.id)?.count || 0,
    }));

    return NextResponse.json({ success: true, categories: enriched });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat kategori." },
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
    const { name, icon, color, type } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Nama kategori dan jenis (EXPENSE/INCOME) wajib diisi." },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        userId: user.id,
        name: name.trim(),
        icon: icon || "Tag",
        color: color || "#1E5BF6",
        type: type.toUpperCase(),
        isDefault: false,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { error: "Gagal membuat kategori baru." },
      { status: 500 }
    );
  }
}
