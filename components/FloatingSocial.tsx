"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "9779841259682";
const FACEBOOK_URL = "https://www.facebook.com/touchparadisetrekking"; // update with real page URL

/* ─── WhatsApp SVG ─── */
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.136.566 4.14 1.541 5.872L0 24l6.293-1.512A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-4.992-1.364l-.358-.214-3.712.893.927-3.617-.234-.372A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
  </svg>
);

/* ─── Facebook SVG ─── */
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.235 2.686.235v2.97h-1.514c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

interface BubbleProps {
  href: string;
  label: string;
  bgColor: string;
  hoverBgColor: string;
  shadowColor: string;
  pulsing?: boolean;
  children: React.ReactNode;
}

const Bubble = ({ href, label, bgColor, hoverBgColor, shadowColor, pulsing = false, children }: BubbleProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative flex items-center group">
      {/* Tooltip */}
      <div
        className={`absolute right-16 whitespace-nowrap px-3 py-1.5 rounded-lg text-white text-sm font-medium pointer-events-none
          transition-all duration-200 ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}
          ${bgColor}`}
        style={{ boxShadow: `0 4px 15px ${shadowColor}` }}
      >
        {label}
        {/* Arrow */}
        <span
          className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0"
          style={{
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: `6px solid ${bgColor === "bg-[#25D366]" ? "#25D366" : "#1877F2"}`,
          }}
        />
      </div>

      {/* Pulse ring (WhatsApp only) */}
      {pulsing && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: shadowColor }}
        />
      )}

      {/* Main button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white
          ${bgColor} ${hoverBgColor}
          shadow-xl transition-all duration-300
          hover:scale-110 active:scale-95`}
        style={{ boxShadow: `0 8px 25px ${shadowColor}` }}
      >
        {children}
      </a>
    </div>
  );
};

const FloatingSocial = () => {
  return (
    <div
      className="fixed bottom-8 right-6 z-50 flex flex-col gap-4 items-end"
      style={{ animation: "slideInRight 0.5s ease-out both" }}
    >
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Facebook */}
      <Bubble
        href={FACEBOOK_URL}
        label="Follow on Facebook"
        bgColor="bg-[#1877F2]"
        hoverBgColor="hover:bg-[#1565d8]"
        shadowColor="rgba(24,119,242,0.45)"
      >
        <FacebookIcon className="w-6 h-6" />
      </Bubble>

      {/* WhatsApp */}
      <Bubble
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        label="Chat on WhatsApp"
        bgColor="bg-[#25D366]"
        hoverBgColor="hover:bg-[#1ebe5d]"
        shadowColor="rgba(37,211,102,0.45)"
        pulsing
      >
        <WhatsAppIcon className="w-6 h-6" />
      </Bubble>
    </div>
  );
};

export default FloatingSocial;
