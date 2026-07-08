"use client";

import { useState } from "react";
import { X, MessageCircle, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "254722595916";
const WHATSAPP_DISPLAY = "+254 722-595-916";
const PREFILLED_MESSAGE = "Hi! I'd like to enquire about a safari.";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

  return (
    <div
      // Right side, clear of ScrollToTop's bottom-left arrow
      className="fixed right-4 bottom-6 z-[60] sm:right-5 hidden lg:block lg:right-6"
      data-analytics-location="floating_whatsapp"
    >
      {/* Popup card */}
      <div
        className={`absolute bottom-[calc(100%+0.75rem)] right-0 w-56 sm:w-64 origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="relative rounded-2xl border border-bone-paper/60 bg-bone-paper/90 p-4 shadow-[0_12px_48px_-8px_rgba(23,22,18,0.22),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl backdrop-saturate-150">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-bone-paper/80 to-transparent" />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-bone-ink/10 text-bone-ink/40 transition-colors hover:bg-bone-ink/15 hover:text-bone-ink/70"
            aria-label="Close"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bone-forest/10 shadow-[0_2px_8px_rgba(26,46,26,0.12),inset_0_1px_0_rgba(255,255,255,0.5)]">
              <WhatsAppIcon className="h-[18px] w-[18px] text-bone-forest" />
            </div>
            <div>
              <p className="text-xs font-bold text-bone-ink font-sans">
                Chat with us
              </p>
              <p className="flex items-center gap-1 text-[10px] text-bone-ink/45 font-sans">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bone-forest-soft opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-bone-forest" />
                </span>
                Online now
              </p>
            </div>
          </div>

          <p className="text-[11px] text-bone-ink/55 leading-relaxed mb-3 font-sans">
            Our safari experts are ready to help you plan the perfect African
            adventure.
          </p>

          <div className="space-y-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-location="floating_whatsapp_popup"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-bone-forest py-2.5 text-xs font-bold text-bone-paper shadow-[0_4px_16px_rgba(26,46,26,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all hover:bg-bone-clay hover:shadow-[0_6px_20px_rgba(157,69,25,0.3)] active:scale-[0.98]"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              Send a message
            </a>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              data-analytics-location="floating_whatsapp_phone"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-bone-ink/15 bg-bone-paper/60 py-2.5 text-xs font-semibold text-bone-ink/80 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-sm transition-all hover:bg-bone-paper/90 hover:border-bone-ink/25 active:scale-[0.98]"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Call us directly
            </a>
          </div>

          <div className="absolute -bottom-2 right-5 h-4 w-4 rotate-45 rounded-sm border-r border-b border-bone-paper/60 backdrop-blur-2xl shadow-[2px_2px_4px_rgba(0,0,0,0.04)]" />
        </div>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={
          open ? "Close WhatsApp chat" : `Chat on WhatsApp: ${WHATSAPP_DISPLAY}`
        }
        className={`group relative flex items-center justify-center rounded-full transition-all duration-300 ease-out
          h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem] lg:h-14 lg:w-14
          border border-bone-forest/30 bg-bone-forest/90
          shadow-[0_6px_28px_-4px_rgba(26,46,26,0.4),0_0_0_1px_rgba(26,46,26,0.1),inset_0_1px_0_rgba(255,255,255,0.15)]
          backdrop-blur-2xl backdrop-saturate-150
          hover:bg-bone-clay hover:border-bone-clay/40 hover:shadow-[0_10px_36px_-4px_rgba(157,69,25,0.4),0_0_0_1px_rgba(157,69,25,0.12),inset_0_1px_0_rgba(255,255,255,0.2)]
          hover:scale-105 hover:-translate-y-0.5
          active:scale-95
          ${open ? "bg-bone-clay border-bone-clay/40 scale-105" : ""}`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/15 via-transparent to-black/10" />
        <div
          className={`transition-all duration-300 ${
            open
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        >
          <WhatsAppIcon className="h-5 w-5 text-bone-paper drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] sm:h-[1.375rem] sm:w-[1.375rem] lg:h-6 lg:w-6" />
        </div>
        <div
          className={`absolute transition-all duration-300 ${
            open
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        >
          <X
            className="h-5 w-5 text-bone-paper sm:h-[1.375rem] sm:w-[1.375rem] lg:h-6 lg:w-6"
            aria-hidden="true"
          />
        </div>
      </button>
    </div>
  );
}
