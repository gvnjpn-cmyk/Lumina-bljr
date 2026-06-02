import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const period = searchParams.get("period") || "month"; // month or week

  const where = period === "week"
    ? { week: getCurrentWeek() }
    : { month: getCurrentMonth() };

  const leaderboard = await prisma.leaderboard.findMany({
    where,
    orderBy: { xp: "desc" },
    take: 100,
    include: {
      user: {
        select: { name: true, image: true, email: true },
      },
    },
  });

  return NextResponse.json(leaderboard);
}

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

function getCurrentWeek(): string {
  const d = new Date();
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, "0")}`;
}
