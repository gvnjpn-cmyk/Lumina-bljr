import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai, SYSTEM_PROMPTS } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chatId, message } = await req.json();

  // Verify chat ownership
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: { orderBy: { createdAt: "asc" }, take: 10 } },
  });

  if (!chat || chat.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Save user message
  await prisma.message.create({
    data: {
      chatId,
      role: "USER",
      content: message,
    },
  });

  // Build conversation history
  const messages = chat.messages.map((m) => ({
    role: m.role.toLowerCase() as "user" | "assistant",
    content: m.content,
  }));

  messages.push({ role: "user" as const, content: message });

  try {
    // Stream response from OpenAI
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.tutor },
        ...messages,
      ] as any,
      stream: true,
      max_tokens: 2000,
      temperature: 0.7,
    });

    let fullContent = "";

    // Create response stream
    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.choices[0].delta.content) {
            const content = chunk.choices[0].delta.content;
            fullContent += content;
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n`));
          }
        }

        // Save assistant message
        await prisma.message.create({
          data: {
            chatId,
            role: "ASSISTANT",
            content: fullContent,
          },
        });

        // Update chat timestamp
        await prisma.chat.update({
          where: { id: chatId },
          data: { updatedAt: new Date() },
        });

        controller.enqueue(new TextEncoder().encode(`data: [DONE]\n`));
        controller.close();
      },
    });

    return new NextResponse(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Stream error:", error);
    return NextResponse.json({ error: "Failed to stream" }, { status: 500 });
  }
}
