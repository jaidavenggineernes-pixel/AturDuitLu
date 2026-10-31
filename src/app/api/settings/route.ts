import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    return NextResponse.json(
      {
        success: true,
        user: {
          id: dbUser?.id,
          name: dbUser?.name,
          email: dbUser?.email,
          settings: dbUser?.settings,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
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

    let updatedUserName = user.name;
    if (name && typeof name === "string" && name.trim().length > 0) {
      const u = await prisma.user.update({
        where: { id: user.id },
        data: { name: name.trim() },
      });
      updatedUserName = u.name;
    }

    const parsedStartingBalance =
      startingBalance !== undefined && startingBalance !== null
        ? parseFloat(String(startingBalance)) || 0
        : 0;

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        startingBalance: parsedStartingBalance,
        currency: currency || "IDR",
        timezone: timezone || "Asia/Jakarta",
        theme: theme || "light",
        notifyBudgetAlert: notifyBudgetAlert ?? true,
        notifyGoalMilestone: notifyGoalMilestone ?? true,
        notifyDailyReminder: notifyDailyReminder ?? true,
      },
      update: {
        ...(startingBalance !== undefined ? { startingBalance: parsedStartingBalance } : {}),
        ...(currency ? { currency } : {}),
        ...(timezone ? { timezone } : {}),
        ...(theme ? { theme } : {}),
        ...(notifyBudgetAlert !== undefined ? { notifyBudgetAlert } : {}),
        ...(notifyGoalMilestone !== undefined ? { notifyGoalMilestone } : {}),
        ...(notifyDailyReminder !== undefined ? { notifyDailyReminder } : {}),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pengaturan berhasil disimpan.",
        user: {
          id: user.id,
          name: updatedUserName,
          email: user.email,
        },
        settings: updatedSettings,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan." },
      { status: 500 }
    );
  }
}
