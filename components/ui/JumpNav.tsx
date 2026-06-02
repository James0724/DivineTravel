"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface JumpNavLink {
  label: string;
  href: string;
}

interface JumpNavProps {
  links: JumpNavLink[];
  label?: string;
  vertical?: boolean;
}

export default function JumpNav({
  links,
  label = "Jump to",
  vertical = false,
}: JumpNavProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!vertical) return;
    const ids = links.map((l) => l.href.replace("#", ""));

    const getActive = () => {
      const threshold = window.innerHeight * 0.35;
      let active = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) active = id;
      }
      setActiveId(active);
    };

    window.addEventListener("scroll", getActive, { passive: true });
    getActive();

    return () => window.removeEventListener("scroll", getActive);
  }, [links, vertical]);

  return (
    <>
      {/* Desktop: sidebar nav list */}
      <nav aria-label={label} className="hidden lg:block">
        <p
          className="font-serif text-[clamp(18px, 5vw, 24px)] uppercase tracking-[0.18em]"
          style={{
            color: "var(--forest, #2a3a2a)",
            borderBottom: "1.5px solid rgba(42,58,42,0.18)",
          }}
        >
          {label}
        </p>
        <ul className="flex flex-col gap-0.5">
          {links.map((l) => {
            const isActive = activeId === l.href.replace("#", "");
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={cn(
                    "flex items-center justify-between w-full py-[15px] border-b border-[rgba(23,22,18,0.07)]",
                    "font-serif font-light leading-[1.1] transition-colors duration-300",
                    "text-[clamp(14px,4vw,18px)]",
                    isActive
                      ? "text-bone-clay"
                      : "text-bone-ink hover:text-bone-clay",
                  )}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
