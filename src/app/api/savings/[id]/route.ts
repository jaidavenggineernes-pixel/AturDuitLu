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

    const goal = await prisma.savingsGoal.findFirst({
      where: { id, userId: user.id },
      include: {
        contributions: { orderBy: { contributionDate: "desc" } },
      },
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Target tabungan tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Goal GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat target tabungan." },
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
    const { name, targetAmount, currentAmount, contributionType, deadline, icon, color } = body;

    const existing = await prisma.savingsGoal.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Target tabungan tidak ditemukan." },
        { status: 404 }
      );
    }

    const updated = await prisma.savingsGoal.update({
      where: { id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(targetAmount !== undefined ? { targetAmount: Math.abs(parseFloat(targetAmount)) } : {}),
        ...(currentAmount !== undefined ? { currentAmount: Math.abs(parseFloat(currentAmount)) } : {}),
        ...(contributionType ? { contributionType } : {}),
        ...(deadline ? { deadline: new Date(deadline) } : {}),
        ...(icon ? { icon } : {}),
        ...(color ? { color } : {}),
      },
    });

    return NextResponse.json({ success: true, goal: updated });
  } catch (error) {
    console.error("Goal PUT error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui target tabungan." },
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

    const existing = await prisma.savingsGoal.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Target tabungan tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.savingsGoal.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Target tabungan berhasil dihapus.",
    });
  } catch (error) {
    console.error("Goal DELETE error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus target tabungan." },
      { status: 500 }
    );
  }
}
