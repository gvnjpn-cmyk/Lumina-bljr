import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeContent } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { documentId } = await req.json();

  const doc = await prisma.document.findUnique({
    where: { id: documentId },
  });

  if (!doc || doc.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!doc.content) {
    return NextResponse.json({ error: "No content to summarize" }, { status: 400 });
  }

  try {
    const summary = await summarizeContent(doc.content, doc.title);

    // Save summary
    const updated = await prisma.document.update({
      where: { id: documentId },
      data: { summary },
    });

    return NextResponse.json({ summary: updated.summary });
  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
