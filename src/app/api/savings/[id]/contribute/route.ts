import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(
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
    const { amount, contributionDate, notes } = body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: "Nominal setoran tabungan harus lebih dari 0." },
        { status: 400 }
      );
    }

    const goal = await prisma.savingsGoal.findFirst({
      where: { id, userId: user.id },
    });

    if (!goal) {
      return NextResponse.json(
        { error: "Target tabungan tidak ditemukan." },
        { status: 404 }
      );
    }

    const parsedAmount = Math.abs(parseFloat(amount));
    const newCurrent = goal.currentAmount + parsedAmount;

    // Create contribution and update goal in transaction
    const [contribution, updatedGoal] = await prisma.$transaction([
      prisma.savingsContribution.create({
        data: {
          userId: user.id,
          savingsGoalId: id,
          amount: parsedAmount,
          contributionDate: contributionDate ? new Date(contributionDate) : new Date(),
          notes: notes ? notes.trim() : null,
        },
      }),
      prisma.savingsGoal.update({
        where: { id },
        data: { currentAmount: newCurrent },
      }),
    ]);

    // Check milestones
    const oldPercent = Math.round((goal.currentAmount / goal.targetAmount) * 100);
    const newPercent = Math.round((newCurrent / goal.targetAmount) * 100);

    if (newPercent >= 100 && oldPercent < 100) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: `🎉 Selamat! Target ${goal.name} Tercapai 100%!`,
          message: `Kamu telah berhasil mengumpulkan ${new Intl.NumberFormat("id-ID").format(
            newCurrent
          )} untuk impian ${goal.name}. Luar biasa!`,
          type: "GOAL_MILESTONE",
          isRead: false,
        },
      });
    } else if (newPercent >= 50 && oldPercent < 50) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: `🎯 Target ${goal.name} Mencapai 50%!`,
          message: `Setengah perjalanan sudah tercapai! Pertahankan kebiasaan menabungmu.`,
          type: "GOAL_MILESTONE",
          isRead: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      contribution,
      goal: updatedGoal,
    });
  } catch (error) {
    console.error("Contribution POST error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan setoran tabungan." },
      { status: 500 }
    );
  }
}
