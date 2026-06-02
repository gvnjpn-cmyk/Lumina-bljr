import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { isBookmarked, difficulty } = await req.json();

  const card = await prisma.flashcard.update({
    where: { id: params.cardId },
    data: {
      ...(isBookmarked !== undefined && { isBookmarked }),
      ...(difficulty !== undefined && { difficulty }),
      ...(isBookmarked === false && { isBookmarked: false }),
    },
  });

  return NextResponse.json(card);
}
