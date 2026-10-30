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
    const { name, icon, color, type } = body;

    const category = await prisma.category.findFirst({
      where: { id, userId: user.id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan atau merupakan kategori default sistem." },
        { status: 404 }
      );
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(icon ? { icon } : {}),
        ...(color ? { color } : {}),
        ...(type ? { type: type.toUpperCase() } : {}),
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Category PUT error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kategori." },
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

    const category = await prisma.category.findFirst({
      where: { id, userId: user.id },
      include: { _count: { select: { transactions: true } } },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan atau merupakan kategori default sistem." },
        { status: 404 }
      );
    }

    if (category._count.transactions > 0) {
      return NextResponse.json(
        {
          error: `Kategori ini masih memiliki ${category._count.transactions} transaksi terkait. Silakan hapus atau ubah kategori transaksi terlebih dahulu.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil dihapus.",
    });
  } catch (error) {
    console.error("Category DELETE error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kategori." },
      { status: 500 }
    );
  }
}
