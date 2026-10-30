import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    const currentUser = await getSessionUser();
    const targetEmail = currentUser?.email || email?.toLowerCase().trim();

    if (!targetEmail || !newPassword) {
      return NextResponse.json(
        { error: "Email dan password baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password baru minimal 8 karakter." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Pengguna dengan email tersebut tidak ditemukan." },
        { status: 404 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat memperbarui password." },
      { status: 500 }
    );
  }
}
