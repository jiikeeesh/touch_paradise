"use client";

import { AlertTriangle, Info, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export type AdvisoryLevel = "caution" | "info";

export interface TrekAdvisory {
  level: AdvisoryLevel;
  headline: string;
  detail: string;
  resolveBy?: string;
  action?: string;
}

interface TrekAdvisoryBannerProps {
  advisory: TrekAdvisory;
  dismissible?: boolean;
  /** "inline" = compact card within trek card; "section" = full-width banner below hero */
  variant?: "inline" | "section";
}

/**
 * TrekAdvisoryBanner — soft advisory notice (caution / info level).
 * Used for trek/region advisories that are NOT hard closures.
 */
export default function TrekAdvisoryBanner({
  advisory,
  dismissible = false,
  variant = "section",
}: TrekAdvisoryBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (dismissed) return null;

  const isWarning = advisory.level === "caution";

  const colors = isWarning
    ? {
        bg: "bg-amber-50",
        border: "border-amber-200",
        iconBg: "bg-amber-500",
        badge: "bg-amber-500",
        badgeText: "text-white",
        headline: "text-amber-900",
        detail: "text-amber-800",
        pill: "bg-amber-100 text-amber-700 border-amber-200",
        action: "text-amber-700",
        toggle: "text-amber-600 hover:text-amber-800",
      }
    : {
        bg: "bg-sky-50",
        border: "border-sky-200",
        iconBg: "bg-sky-500",
        badge: "bg-sky-500",
        badgeText: "text-white",
        headline: "text-sky-900",
        detail: "text-sky-800",
        pill: "bg-sky-100 text-sky-700 border-sky-200",
        action: "text-sky-700",
        toggle: "text-sky-600 hover:text-sky-800",
      };

  const Icon = isWarning ? AlertTriangle : Info;

  if (variant === "inline") {
    return (
      <div className={`rounded-xl border ${colors.border} ${colors.bg} p-3.5 text-sm`}>
        <div className="flex items-start gap-2.5">
          <div className={`flex-shrink-0 w-6 h-6 ${colors.iconBg} rounded-lg flex items-center justify-center mt-0.5`}>
            <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-[10px] font-black uppercase tracking-widest ${colors.badge} ${colors.badgeText} px-2 py-0.5 rounded-full mb-1`}>
              {isWarning ? "⚠ Travel Advisory" : "ℹ Notice"}
            </span>
            <p className={`font-bold text-xs ${colors.headline} leading-snug`}>
              {advisory.headline}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Section variant — full width, used on region pages and trek detail pages
  return (
    <div className={`w-full border-y ${colors.border} ${colors.bg}`}>
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-10 h-10 ${colors.iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
            <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-black uppercase tracking-widest ${colors.badge} ${colors.badgeText} px-2.5 py-0.5 rounded-full`}>
                {isWarning ? "⚠ Travel Advisory" : "ℹ Travel Notice"}
              </span>
              {advisory.resolveBy && (
                <span className={`text-[10px] font-semibold border ${colors.pill} px-2 py-0.5 rounded-full`}>
                  Est. resolved: {advisory.resolveBy}
                </span>
              )}
            </div>

            <p className={`font-bold text-sm md:text-base ${colors.headline} mb-1 leading-snug`}>
              {advisory.headline}
            </p>

            {/* Expandable detail on mobile */}
            <div className={`text-sm ${colors.detail} leading-relaxed ${expanded ? "" : "line-clamp-2 md:line-clamp-none"}`}>
              {advisory.detail}
            </div>

            {/* Expand toggle — visible only on small screens */}
            <button
              onClick={() => setExpanded(!expanded)}
              className={`mt-1 text-xs font-semibold ${colors.toggle} flex items-center gap-1 md:hidden`}
            >
              {expanded ? (
                <><ChevronUp className="w-3 h-3" /> Show less</>
              ) : (
                <><ChevronDown className="w-3 h-3" /> Read more</>
              )}
            </button>

            {advisory.action && (
              <p className={`mt-2 text-xs font-bold ${colors.action} flex items-center gap-1.5`}>
                <span className="text-base">→</span> {advisory.action}
              </p>
            )}
          </div>

          {/* Dismiss button */}
          {dismissible && (
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss advisory"
              className={`flex-shrink-0 w-8 h-8 bg-black/5 hover:bg-black/10 rounded-lg flex items-center justify-center transition-colors`}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
