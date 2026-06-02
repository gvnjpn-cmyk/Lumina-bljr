import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const subject = formData.get("subject") as string;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  try {
    // Upload to Vercel Blob
    const blob = await put(`${session.user.id}/${Date.now()}-${file.name}`, file, {
      access: "private",
    });

    // Create document record
    const document = await prisma.document.create({
      data: {
        userId: session.user.id,
        title: title || file.name,
        subject: subject || "Umum",
        fileUrl: blob.url,
        fileType: getFileType(file.name),
        content: "", // Will be processed later
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

function getFileType(
  filename: string
): "PDF" | "DOCX" | "PPTX" | "TXT" | "IMAGE" | "YOUTUBE" {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "PDF";
    case "docx":
      return "DOCX";
    case "pptx":
      return "PPTX";
    case "txt":
      return "TXT";
    case "jpg":
    case "jpeg":
    case "png":
      return "IMAGE";
    default:
      return "TXT";
  }
}
