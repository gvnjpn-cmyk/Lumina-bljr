import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { answers, mode = "PRACTICE" } = await req.json();

  // Get quiz with questions
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.quizId },
    include: { questions: true },
  });

  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  // Calculate score
  let totalPoints = 0;
  let correctCount = 0;
  const answerResults = [];

  for (const question of quiz.questions) {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correctAnswer;
    const pointsEarned = isCorrect ? question.points : 0;

    totalPoints += question.points;
    if (isCorrect) correctCount++;

    answerResults.push({
      questionId: question.id,
      answer: userAnswer,
      isCorrect,
      pointsEarned,
    });
  }

  const score = Math.round((correctCount / quiz.questions.length) * 100);

  // Save attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      quizId: params.quizId,
      mode,
      score,
      totalPoints: correctCount * 10,
      completed: true,
      completedAt: new Date(),
      answers: {
        create: answerResults.map((a) => ({
          questionId: a.questionId,
          answer: a.answer,
          isCorrect: a.isCorrect,
          pointsEarned: a.pointsEarned,
        })),
      },
    },
    include: { answers: true },
  });

  // Update user XP
  const xpGained = correctCount * 10;
  await prisma.user.update({
    where: { id: session.user.id },
    data: { totalXP: { increment: xpGained } },
  });

  return NextResponse.json({
    score,
    totalPoints: correctCount * 10,
    correctCount,
    totalCount: quiz.questions.length,
    xpGained,
  });
}
