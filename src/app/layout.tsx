import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Lumina AI — Platform Belajar Berbasis AI",
    template: "%s | Lumina AI",
  },
  description:
    "Platform EdTech AI modern untuk siswa SMP, SMA, mahasiswa, dan guru. Belajar lebih cerdas dengan AI Tutor, Quiz Generator, Flashcard, dan Bank Soal.",
  keywords: ["edtech", "AI tutor", "belajar online", "quiz generator", "flashcard", "tryout"],
  authors: [{ name: "Lumina AI" }],
  openGraph: {
    title: "Lumina AI — Platform Belajar Berbasis AI",
    description: "Belajar lebih cerdas dengan bantuan AI",
    type: "website",
    locale: "id_ID",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="id" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen bg-background text-foreground antialiased`}
      >
        <SessionProvider session={session}>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "hsl(222, 47%, 10%)",
                border: "1px solid hsl(222, 30%, 16%)",
                color: "hsl(210, 40%, 96%)",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
