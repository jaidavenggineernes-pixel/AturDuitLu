import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken, createSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password minimal terdiri dari 8 karakter." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login atau gunakan email lain." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        settings: {
          create: {
            startingBalance: 0,
            currency: "IDR",
            timezone: "Asia/Jakarta",
            theme: "light",
            notifyBudgetAlert: true,
            notifyGoalMilestone: true,
            notifyDailyReminder: true,
          },
        },
        notifications: {
          create: {
            title: "Selamat Datang di AturDuitLu! 🎉",
            message: "Platform Personal Finance Management kamu sudah aktif. Mulai catat transaksi pertamamu sekarang!",
            type: "SYSTEM",
            isRead: false,
          },
        },
      },
      include: {
        settings: true,
      },
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    await createSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        settings: newUser.settings,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat mendaftar akun." },
      { status: 500 }
    );
  }
}
