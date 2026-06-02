"use client"

import { MotionConfig } from "framer-motion"

export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
    >
      {children}
    </MotionConfig>
  )
}
