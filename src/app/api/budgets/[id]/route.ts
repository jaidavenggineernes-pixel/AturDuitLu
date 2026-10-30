import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { categoryId, amount, periodType, startDate, endDate } = body;

    const existing = await prisma.budget.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Anggaran tidak ditemukan." },
        { status: 404 }
      );
    }

    const updated = await prisma.budget.update({
      where: { id },
      data: {
        ...(amount !== undefined ? { amount: Math.abs(parseFloat(amount)) } : {}),
        ...(categoryId !== undefined
          ? { categoryId: categoryId === "ALL" || !categoryId ? null : categoryId }
          : {}),
        ...(periodType ? { periodType: periodType.toUpperCase() } : {}),
        ...(startDate ? { startDate: new Date(startDate) } : {}),
        ...(endDate ? { endDate: new Date(endDate) } : {}),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, budget: updated });
  } catch (error) {
    console.error("Budget PUT error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui anggaran." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.budget.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Anggaran tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.budget.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Anggaran berhasil dihapus.",
    });
  } catch (error) {
    console.error("Budget DELETE error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus anggaran." },
      { status: 500 }
    );
  }
}
