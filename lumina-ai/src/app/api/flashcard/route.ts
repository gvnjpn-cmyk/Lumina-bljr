import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const sets = await prisma.flashcardSet.findMany({
    where: { userId: session.user.id },
    include: {
      cards: { orderBy: { order: "asc" } },
      _count: { select: { cards: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(sets);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, subject, cards } = await req.json();

  const set = await prisma.flashcardSet.create({
    data: {
      userId: session.user.id,
      title,
      description,
      subject,
      cards: {
        create: cards.map((c: any, idx: number) => ({
          front: c.front,
          back: c.back,
          hint: c.hint,
          order: idx,
        })),
      },
    },
    include: {
      cards: true,
      _count: { select: { cards: true } },
    },
  });

  return NextResponse.json(set);
}
