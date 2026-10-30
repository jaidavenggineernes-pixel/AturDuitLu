import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
      include: { category: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error("Transaction GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat transaksi." },
      { status: 500 }
    );
  }
}

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
    const {
      name,
      amount,
      type,
      categoryId,
      transactionDate,
      paymentMethod,
      notes,
    } = body;

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(amount !== undefined ? { amount: Math.abs(parseFloat(amount)) } : {}),
        ...(type ? { type: type.toUpperCase() } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(transactionDate ? { transactionDate: new Date(transactionDate) } : {}),
        ...(paymentMethod ? { paymentMethod } : {}),
        notes: notes !== undefined ? (notes ? notes.trim() : null) : existing.notes,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, transaction: updated });
  } catch (error) {
    console.error("Transaction PUT error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui transaksi." },
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

    const existing = await prisma.transaction.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transaksi tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi berhasil dihapus.",
    });
  } catch (error) {
    console.error("Transaction DELETE error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus transaksi." },
      { status: 500 }
    );
  }
}
