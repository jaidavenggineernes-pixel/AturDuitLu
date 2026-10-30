import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await prisma.savingsGoal.findMany({
      where: { userId: user.id },
      include: {
        contributions: {
          orderBy: { contributionDate: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

    const enrichedGoals = goals.map((g) => {
      const percentage =
        g.targetAmount > 0 ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100)) : 0;
      return {
        ...g,
        progressPercentage: percentage,
        remainingAmount: Math.max(0, g.targetAmount - g.currentAmount),
      };
    });

    return NextResponse.json({
      success: true,
      totalSavings,
      totalTarget,
      overallProgress: totalTarget > 0 ? Math.round((totalSavings / totalTarget) * 100) : 0,
      goals: enrichedGoals,
    });
  } catch (error) {
    console.error("Savings GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat target tabungan." },
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
    const { name, targetAmount, contributionType, deadline, icon, color } = body;

    if (!name || !targetAmount || !deadline) {
      return NextResponse.json(
        { error: "Nama target, nominal target, dan tenggat waktu wajib diisi." },
        { status: 400 }
      );
    }

    const parsedTarget = Math.abs(parseFloat(targetAmount));

    const goal = await prisma.savingsGoal.create({
      data: {
        userId: user.id,
        name: name.trim(),
        targetAmount: parsedTarget,
        currentAmount: 0,
        contributionType: contributionType || "MONTHLY",
        deadline: new Date(deadline),
        icon: icon || "Target",
        color: color || "#1E5BF6",
      },
    });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Savings POST error:", error);
    return NextResponse.json(
      { error: "Gagal membuat target tabungan." },
      { status: 500 }
    );
  }
}
