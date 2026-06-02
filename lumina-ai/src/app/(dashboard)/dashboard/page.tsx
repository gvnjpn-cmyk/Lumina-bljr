import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { xpToLevel, xpProgress, xpForNextLevel, formatRelativeTime } from "@/lib/utils";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  const [user, recentAttempts, recentChats, totalDocs, weekProgress] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { leaderboard: true },
    }),
    prisma.quizAttempt.findMany({
      where: { userId, completed: true },
      orderBy: { completedAt: "desc" },
      take: 5,
      include: { quiz: { select: { title: true } } },
    }),
    prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
    }),
    prisma.document.count({ where: { userId } }),
    prisma.progress.findMany({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  const avgScore =
    recentAttempts.length > 0
      ? Math.round(recentAttempts.reduce((a, b) => a + b.score, 0) / recentAttempts.length)
      : 0;

  const stats = {
    totalDocuments: totalDocs,
    totalQuizAttempts: recentAttempts.length,
    averageScore: avgScore,
    currentStreak: user?.streak || 0,
    totalXP: user?.totalXP || 0,
    level: xpToLevel(user?.totalXP || 0),
    xpProgress: xpProgress(user?.totalXP || 0),
    xpForNext: xpForNextLevel(user?.totalXP || 0),
  };

  const recentActivity = recentAttempts.map((a) => ({
    id: a.id,
    type: "quiz",
    title: a.quiz.title,
    score: a.score,
    createdAt: a.completedAt || a.startedAt,
  }));

  return (
    <DashboardClient
      user={{
        name: session.user.name || "Pengguna",
        email: session.user.email || "",
        image: session.user.image || null,
      }}
      stats={stats}
      recentActivity={recentActivity}
      recentChats={recentChats}
    />
  );
}
