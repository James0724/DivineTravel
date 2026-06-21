"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function TwoQuestionsImage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
        transition={{ duration: 1.15, delay: 0.1, ease: EASE }}
      >
        <Image
          src="https://images.pexels.com/photos/12339600/pexels-photo-12339600.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80"
          alt="Safari guide planning a route through the bush"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </motion.div>

      {/* Clay accent corner */}
      <motion.div
        className="absolute bottom-0 left-0 w-12 h-1"
        style={{ background: "#9d4519", transformOrigin: "0 0" }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
      />

      {/* Floating caption badge */}
      <motion.div
        className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-bone-paper px-3 sm:px-4 py-2 sm:py-2.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em]"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
      >
        <strong className="text-bone-clay font-medium">Every itinerary starts here</strong>
      </motion.div>
    </div>
  );
}
