import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const quizzes = await prisma.quiz.findMany({
    where: { OR: [{ creatorId: session.user.id }, { isPublic: true }] },
    include: {
      questions: true,
      _count: { select: { attempts: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(quizzes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, questions, subject, timeLimit } = await req.json();

  const quiz = await prisma.quiz.create({
    data: {
      title,
      description,
      subject,
      timeLimit,
      creatorId: session.user.id,
      isPublic: false,
      questions: {
        create: questions.map((q: any, idx: number) => ({
          type: q.type,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points || 10,
          order: idx,
        })),
      },
    },
    include: { questions: true },
  });

  return NextResponse.json(quiz);
}
