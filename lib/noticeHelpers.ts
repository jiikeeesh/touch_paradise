/**
 * Server-side helper to fetch active TravelNotice records from the database.
 * Used by public-facing pages (treks, services) to display admin-issued notices.
 */

import { prisma } from "@/lib/prisma";

export type DbNotice = {
  id: string;
  severity: "CLOSURE" | "ADVISORY";
  targetType: "TREK" | "REGION" | "SERVICE" | "GLOBAL";
  targetSlug: string;
  headline: string;
  detail: string;
  actionText: string;
  resolveBy: string;
  active: boolean;
};

/**
 * Helper to fetch and categorize notices from the database.
 */
export async function getActiveNotices(): Promise<DbNotice[]> {
  try {
    const notices = await (prisma as any).travelNotice.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return notices as DbNotice[];
  } catch {
    return [];
  }
}

/**
 * Get the most severe active notice for a specific trek/region/service slug.
 * Closure takes priority over Advisory.
 * Also checks for GLOBAL notices.
 */
export function getNoticeForSlug(
  notices: DbNotice[],
  targetType: "TREK" | "REGION" | "SERVICE",
  slug: string
): DbNotice | null {
  const matching = notices.filter(
    (n) =>
      (n.targetType === targetType && n.targetSlug === slug) ||
      n.targetType === "GLOBAL"
  );
  if (matching.length === 0) return null;
  // CLOSURE takes priority
  const closure = matching.find((n) => n.severity === "CLOSURE");
  return closure ?? matching[0];
}

/**
 * Check if a trek/region has a CLOSURE severity notice active.
 */
export function isSlugClosed(
  notices: DbNotice[],
  targetType: "TREK" | "REGION" | "SERVICE",
  slug: string
): boolean {
  return notices.some(
    (n) =>
      n.severity === "CLOSURE" &&
      ((n.targetType === targetType && n.targetSlug === slug) ||
        n.targetType === "GLOBAL")
  );
}

/**
 * Get all global notices (targetType === "GLOBAL").
 */
export function getGlobalNotices(notices: DbNotice[]): DbNotice[] {
  return notices.filter((n) => n.targetType === "GLOBAL");
}
