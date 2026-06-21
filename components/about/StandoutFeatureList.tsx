"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface StandoutItem {
  ic: string;
  title: ReactNode;
  body: string;
}

export default function StandoutFeatureList({
  items,
}: {
  items: StandoutItem[];
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInView = useInView(contentRef, {
    once: true,
    margin: "-80px",
  });

  return (
    <div ref={contentRef} className="flex flex-col">
      {items.map((f, i) => (
        <motion.div
          key={f.ic}
          className="py-6 border-t grid gap-[18px] items-start group"
          style={{
            gridTemplateColumns: "36px 1fr",
            borderColor: "rgba(23,22,18,0.14)",
            borderBottom:
              i === items.length - 1
                ? "1px solid rgba(23,22,18,0.14)"
                : undefined,
          }}
          initial={{ opacity: 0, x: -24 }}
          animate={contentInView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.35 + i * 0.1,
            ease: EASE,
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-serif italic text-[16px] flex-shrink-0"
            style={{ background: "#9d4519" }}
          >
            {f.ic}
          </div>
          <div>
            <h4 className="font-serif font-medium text-[22px] text-bone-ink mb-1 leading-[1.1]">
              {f.title}
            </h4>
            <p className="text-[14px] leading-[1.55] text-bone-muted">
              {f.body}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
