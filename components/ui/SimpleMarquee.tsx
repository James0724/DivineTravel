'use client'

import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

/** Wraps a number so it cycles in [min, max) */
function wrap(min: number, max: number, v: number): number {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

export interface SimpleMarqueeProps {
  children: React.ReactNode
  className?: string
  /** Scroll direction. Default: 'left' */
  direction?: 'left' | 'right' | 'up' | 'down'
  /** Percentage units per second (0–100 = one full loop). Default: 20 */
  baseVelocity?: number
  /** Slow down while the user hovers. Default: false */
  slowdownOnHover?: boolean
  /** Speed multiplier applied while hovering (0 = pause). Default: 0.08 */
  slowDownFactor?: number
  slowDownSpringConfig?: { damping: number; stiffness: number }
  /** Boost velocity based on page scroll speed. Default: false */
  useScrollVelocity?: boolean
  /** Flip direction based on scroll direction. Default: false */
  scrollAwareDirection?: boolean
  scrollSpringConfig?: { damping: number; stiffness: number }
  /** Custom scroll container ref. Defaults to the window. */
  scrollContainer?: React.RefObject<HTMLElement>
  /** Number of times the children are duplicated. Default: 6 */
  repeat?: number
  /** Allow click-drag to influence speed. Default: true */
  draggable?: boolean
  dragSensitivity?: number
  dragVelocityDecay?: number
  dragAwareDirection?: boolean
  dragAngle?: number
  /** Show grab cursor while hovering. Default: false */
  grabCursor?: boolean
  /** Custom easing function for the position (advanced). */
  easing?: (t: number) => number
}

export default function SimpleMarquee({
  children,
  className = '',
  direction = 'left',
  baseVelocity = 20,
  slowdownOnHover = false,
  slowDownFactor = 0.08,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },
  useScrollVelocity: useScrollVelocityProp = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,
  repeat = 6,
  draggable = true,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  dragAngle = 0,
  grabCursor = false,
  easing,
}: SimpleMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const baseX = useMotionValue(0)
  const baseY = useMotionValue(0)

  /* Pause animation when scrolled out of view */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '50px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* Scroll velocity for boost mode */
  const { scrollY } = useScroll(
    scrollContainer ? { container: scrollContainer as React.RefObject<HTMLElement> } : {}
  )
  const scrollVelocity  = useVelocity(scrollY)
  const smoothVelocity  = useSpring(scrollVelocity, scrollSpringConfig)
  const defaultVelocity = useMotionValue(1)
  const velocityFactor  = useTransform(
    useScrollVelocityProp ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false }
  )

  /* Hover slow-down */
  const hoverFactorValue = useMotionValue(1)
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig)
  const isHovered = useRef(false)

  /* Drag */
  const isDragging       = useRef(false)
  const dragVelocityRef  = useRef(0)
  const directionFactor  = useRef(1)
  const lastPointerPos   = useRef({ x: 0, y: 0 })

  const isHorizontal     = direction === 'left' || direction === 'right'
  const actualVelocity   = direction === 'left' || direction === 'up' ? -baseVelocity : baseVelocity

  /* Position transforms — wrap 0 → -100 (%) for seamless looping */
  const x = useTransform(baseX, (v) => {
    const w = wrap(0, -100, v)
    return `${easing ? easing(w / -100) * -100 : w}%`
  })
  const y = useTransform(baseY, (v) => {
    const w = wrap(0, -100, v)
    return `${easing ? easing(w / -100) * -100 : w}%`
  })

  useAnimationFrame((_t, delta) => {
    if (!isVisible) return

    /* Drag takes over */
    if (isDragging.current && draggable) {
      if (isHorizontal) baseX.set(baseX.get() + dragVelocityRef.current)
      else              baseY.set(baseY.get() + dragVelocityRef.current)
      dragVelocityRef.current *= 0.9
      if (Math.abs(dragVelocityRef.current) < 0.01) dragVelocityRef.current = 0
      return
    }

    hoverFactorValue.set(isHovered.current && slowdownOnHover ? slowDownFactor : 1)

    let moveBy =
      directionFactor.current * actualVelocity * (delta / 1000) * smoothHoverFactor.get()

    if (scrollAwareDirection && !isDragging.current) {
      const vf = velocityFactor.get()
      if (vf < 0) directionFactor.current = -1
      else if (vf > 0) directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    if (draggable) {
      moveBy += dragVelocityRef.current
      if (dragAwareDirection && Math.abs(dragVelocityRef.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocityRef.current)
      }
      if (!isDragging.current) {
        dragVelocityRef.current =
          Math.abs(dragVelocityRef.current) > 0.01
            ? dragVelocityRef.current * dragVelocityDecay
            : 0
      }
    }

    if (isHorizontal) baseX.set(baseX.get() + moveBy)
    else              baseY.set(baseY.get() + moveBy)
  })

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return
    e.currentTarget.setPointerCapture(e.pointerId)
    if (grabCursor) e.currentTarget.style.cursor = 'grabbing'
    isDragging.current = true
    lastPointerPos.current = { x: e.clientX, y: e.clientY }
    dragVelocityRef.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || !isDragging.current) return
    const cur = { x: e.clientX, y: e.clientY }
    const rad = (dragAngle * Math.PI) / 180
    dragVelocityRef.current =
      (cur.x - lastPointerPos.current.x) * Math.cos(rad) * dragSensitivity +
      (cur.y - lastPointerPos.current.y) * Math.sin(rad) * dragSensitivity
    lastPointerPos.current = cur
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return
    e.currentTarget.releasePointerCapture(e.pointerId)
    isDragging.current = false
  }

  return (
    <motion.div
      ref={containerRef}
      className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} ${className}`}
      onHoverStart={() => (isHovered.current = true)}
      onHoverEnd={() => (isHovered.current = false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <motion.div
          key={i}
          aria-hidden={i > 0}
          className={`shrink-0 ${isHorizontal ? 'flex' : ''} ${draggable && grabCursor ? 'cursor-grab' : ''}`}
          style={isHorizontal ? { x } : { y }}
        >
          {children}
        </motion.div>
      ))}
    </motion.div>
  )
}
