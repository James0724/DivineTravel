"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

interface FloatingCoords {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
}

/**
 * Computes viewport-clamped fixed-position coordinates for a trigger-anchored
 * dropdown panel meant to be rendered through a portal (so it can't be cut
 * off by an ancestor's `overflow: hidden`, e.g. the footer's decorative blur
 * shapes). Re-measures on resize/scroll while open so the panel tracks its
 * trigger.
 */
export function useFloatingDropdown(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  dropDirection: "up" | "down",
  preferredWidth: number,
) {
  const [coords, setCoords] = useState<FloatingCoords | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    function update() {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const margin = 16;
      const width = Math.min(preferredWidth, window.innerWidth - margin * 2);
      const left = Math.min(
        Math.max(rect.right - width, margin),
        window.innerWidth - width - margin,
      );
      setCoords(
        dropDirection === "up"
          ? { left, width, bottom: window.innerHeight - rect.top + 10 }
          : { left, width, top: rect.bottom + 10 },
      );
    }

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, triggerRef, dropDirection, preferredWidth]);

  return coords;
}
