import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) return formatDate(date);
  if (days > 0) return `${days} hari lalu`;
  if (hours > 0) return `${hours} jam lalu`;
  if (minutes > 0) return `${minutes} menit lalu`;
  return "Baru saja";
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function xpToLevel(xp: number) {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function levelToXP(level: number) {
  return Math.pow(level - 1, 2) * 100;
}

export function xpForNextLevel(currentXP: number) {
  const currentLevel = xpToLevel(currentXP);
  return levelToXP(currentLevel + 1);
}

export function xpProgress(currentXP: number) {
  const currentLevel = xpToLevel(currentXP);
  const currentLevelXP = levelToXP(currentLevel);
  const nextLevelXP = levelToXP(currentLevel + 1);
  return ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
}

export function scoreToGrade(score: number): { grade: string; color: string } {
  if (score >= 90) return { grade: "A", color: "text-emerald-400" };
  if (score >= 80) return { grade: "B", color: "text-blue-400" };
  if (score >= 70) return { grade: "C", color: "text-yellow-400" };
  if (score >= 60) return { grade: "D", color: "text-orange-400" };
  return { grade: "E", color: "text-red-400" };
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
