import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, grade } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama, email, dan password diperlukan" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        grade: grade || null,
        role: "STUDENT",
      },
    });

    // Create leaderboard entry
    await prisma.leaderboard.create({
      data: {
        userId: user.id,
        month: new Date().toISOString().slice(0, 7),
        week: `${new Date().getFullYear()}-W${getWeekNumber(new Date())}`,
      },
    });

    return NextResponse.json({
      message: "Akun berhasil dibuat",
      userId: user.id,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

function getWeekNumber(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNo.toString().padStart(2, "0");
}
