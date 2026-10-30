import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { settings: true },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser?.id,
        name: dbUser?.name,
        email: dbUser?.email,
        settings: dbUser?.settings,
      },
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { error: "Gagal memuat pengaturan." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      startingBalance,
      currency,
      timezone,
      theme,
      notifyBudgetAlert,
      notifyGoalMilestone,
      notifyDailyReminder,
    } = body;

    if (name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name: name.trim() },
      });
    }

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        startingBalance: startingBalance !== undefined ? parseFloat(startingBalance) : 0,
        currency: currency || "IDR",
        timezone: timezone || "Asia/Jakarta",
        theme: theme || "light",
        notifyBudgetAlert: notifyBudgetAlert ?? true,
        notifyGoalMilestone: notifyGoalMilestone ?? true,
        notifyDailyReminder: notifyDailyReminder ?? true,
      },
      update: {
        ...(startingBalance !== undefined ? { startingBalance: parseFloat(startingBalance) } : {}),
        ...(currency ? { currency } : {}),
        ...(timezone ? { timezone } : {}),
        ...(theme ? { theme } : {}),
        ...(notifyBudgetAlert !== undefined ? { notifyBudgetAlert } : {}),
        ...(notifyGoalMilestone !== undefined ? { notifyGoalMilestone } : {}),
        ...(notifyDailyReminder !== undefined ? { notifyDailyReminder } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pengaturan berhasil disimpan.",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan." },
      { status: 500 }
    );
  }
}
