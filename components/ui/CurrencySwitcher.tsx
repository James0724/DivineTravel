"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency/useCurrency";
import {
  SUPPORTED_CURRENCIES,
  CURRENCY_META,
  type CurrencyCode,
} from "@/lib/currency/constants";
import FlagIcon from "@/components/ui/FlagIcon";
import { useFloatingDropdown } from "@/hooks/useFloatingDropdown";

export default function CurrencySwitcher({
  className,
  variant = "text",
  dropDirection = "down",
}: {
  className?: string;
  variant?: "text" | "pill";
  dropDirection?: "down" | "up";
}) {
  const t = useTranslations("common");
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const coords = useFloatingDropdown(open, triggerRef, dropDirection, 300);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SUPPORTED_CURRENCIES;
    return SUPPORTED_CURRENCIES.filter((code) => {
      const meta = CURRENCY_META[code];
      return (
        code.toLowerCase().includes(q) || meta.name.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const activeMeta = CURRENCY_META[currency];

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          variant === "pill"
            ? "flex items-center gap-1 rounded-full border border-bone-ink/15 bg-bone-paper px-2.5 py-1 text-[10px] font-semibold text-bone-ink/80 transition-all hover:border-bone-clay hover:bg-white hover:text-bone-clay"
            : "flex items-center gap-1 font-mono text-[12px] tracking-[0.04em] text-bone-ink/75 hover:text-bone-clay transition-colors",
        )}
        aria-label={t("currencySwitcher.ariaLabel")}
        aria-expanded={open}
      >
        {variant === "pill" ? (
          <FlagIcon
            countryCode={activeMeta.countryCode}
            className="h-[9px] w-3"
          />
        ) : (
          <span aria-hidden="true">{activeMeta.symbol}</span>
        )}
        <span className={variant === "pill" ? "font-semibold" : undefined}>
          {currency}
        </span>
        <ChevronDown
          size={variant === "pill" ? 8 : 12}
          strokeWidth={2}
          className={cn(
            "text-bone-ink/50 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && coords && (
              <motion.div
                ref={panelRef}
                initial={{ opacity: 0, y: dropDirection === "up" ? 4 : -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dropDirection === "up" ? 4 : -4 }}
                transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  position: "fixed",
                  left: coords.left,
                  width: coords.width,
                  top: coords.top,
                  bottom: coords.bottom,
                }}
                className="z-[300] max-h-[min(400px,70vh)] overflow-hidden rounded-xl border border-bone-ink/12 bg-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
              >
                <div className="border-b border-bone-ink/8 bg-bone-bg/40 px-3 pt-2.5 pb-2">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-bone-ink/55">
                      {t("currencySwitcher.selectTitle")}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-bone-ink/40 transition-colors hover:bg-bone-ink/10 hover:text-bone-ink/70"
                      aria-label={t("menu.close")}
                    >
                      <X size={12} strokeWidth={2.2} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="relative">
                    <Search
                      size={12}
                      className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-bone-ink/35"
                    />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t("currencySwitcher.searchPlaceholder")}
                      className="h-7 w-full rounded-md border border-bone-ink/12 bg-white pl-7 pr-2 text-[11px] text-bone-ink placeholder:text-bone-ink/40 outline-none focus:border-bone-clay focus:ring-1 focus:ring-bone-clay/35"
                    />
                  </div>
                </div>

                <div className="max-h-[min(260px,45vh)] overflow-y-auto p-1">
                  {filtered.length === 0 && (
                    <p className="px-4 py-6 text-center text-[12px] text-bone-ink/45 font-sans">
                      {t("currencySwitcher.noResults")}
                    </p>
                  )}
                  {filtered.map((code) => {
                    const meta = CURRENCY_META[code];
                    const active = code === currency;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setCurrency(code as CurrencyCode);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] transition-all",
                          active
                            ? "bg-gradient-to-r from-bone-clay/10 to-bone-clay/5 font-semibold text-bone-clay ring-1 ring-bone-clay/25"
                            : "text-bone-ink/70 hover:bg-bone-bg/60",
                        )}
                      >
                        <FlagIcon
                          countryCode={meta.countryCode}
                          className="h-3 w-4"
                        />
                        <span className="w-9 shrink-0 font-bold text-bone-ink/85">
                          {code}
                        </span>
                        <span className="flex-1 truncate text-[10px] text-bone-ink/50">
                          {meta.name}
                        </span>
                        <span className="shrink-0 text-[10px] font-semibold tabular-nums text-bone-ink/40">
                          {meta.symbol}
                        </span>
                        {active && (
                          <span className="shrink-0 text-[10px] text-bone-clay">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-bone-ink/8 px-3 py-1.5">
                  <p className="text-[9px] text-bone-ink/40">
                    {t("currencySwitcher.footerCount", {
                      count: filtered.length,
                      total: SUPPORTED_CURRENCIES.length,
                    })}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
