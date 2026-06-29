'use client'

import { useState } from 'react'
import Image, { type ImageProps } from 'next/image'
import { ImageOff } from 'lucide-react'
import { cn, cloudinaryUrl } from '@/lib/utils'

type OmittedProps = 'src' | 'placeholder' | 'blurDataURL' | 'onError' | 'unoptimized' | 'quality'

interface OptimizedImageProps extends Omit<ImageProps, OmittedProps> {
  src: string
  /**
   * Pixel size for a square, CDN-side crop — use for predictable card/grid/avatar thumbnails
   * so the browser downloads a right-sized image instead of the full-size original.
   * Omit for hero/full-bleed images where the crop isn't a fixed size.
   */
  thumbSize?: number
  /** Show a blur-up placeholder while loading (default true) */
  shimmer?: boolean
}

function isCloudinary(src: string): boolean {
  return src.includes('res.cloudinary.com') && src.includes('/upload/')
}

// Neutral warm-grey fill — matches the site's --bg-soft tone
const SHIMMER_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect fill='%23e8e2d9'/%3E%3C/svg%3E"

/**
 * Drop-in replacement for next/image for ANY image in this app, Cloudinary or not.
 *
 * - Cloudinary sources are delivered straight from Cloudinary's CDN with `q_auto,f_auto`
 *   (and an optional `thumbSize` crop) instead of being routed through Next's image
 *   optimizer, which is slow for on-demand resizing and unnecessary since Cloudinary
 *   already negotiates format/quality. Transformations are always applied to the
 *   *existing* delivery URL (which carries the `/v<digits>/` version segment) via
 *   `cloudinaryUrl()` — never rebuilt from a bare public ID — so a folder name that
 *   happens to look like transform shorthand (e.g. `web_images/...`) can't get
 *   misparsed into a 400.
 *   Full-bleed (no `thumbSize`) Cloudinary images are still capped at `w_1920,c_limit`
 *   so an original upload (often 4000px+) isn't served byte-for-byte.
 * - Non-Cloudinary sources (Unsplash, Pexels, local) fall through to Next's normal
 *   optimization pipeline unchanged.
 * - If the image fails to load for any reason, it degrades to a neutral placeholder
 *   instead of the browser's broken-image icon.
 *
 * @example
 * // grid/card thumbnail — request a right-sized crop from Cloudinary
 * <OptimizedImage src={url} alt="..." fill thumbSize={400} className="object-cover" />
 *
 * // hero / full-bleed — no fixed crop, just format/quality negotiation
 * <OptimizedImage src={url} alt="..." fill priority className="object-cover" />
 */
export default function OptimizedImage({
  src,
  alt,
  shimmer = true,
  sizes,
  fill,
  width,
  height,
  priority,
  thumbSize,
  className,
  style,
  ...rest
}: OptimizedImageProps) {
  const [errored, setErrored] = useState(false)
  const cloudinary = isCloudinary(src)

  const resolvedSrc = cloudinary
    ? cloudinaryUrl(
        src,
        thumbSize
          ? `w_${thumbSize},h_${thumbSize},c_fill,g_auto,q_auto,f_auto`
          // Full-bleed images still need a width cap — without it Cloudinary serves the
          // original upload (often 4000px+ from camera/stock sources) at multiple MB,
          // which is what caused the hero carousel's visible loading gap between slides.
          : 'w_1920,c_limit,q_auto,f_auto'
      )
    : src

  const blurSrc = cloudinary ? cloudinaryUrl(src, 'w_16,q_1,e_blur:1000,f_auto') : undefined

  const defaultSizes =
    sizes ??
    (fill ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : undefined)

  if (errored) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-bone-bg text-bone-ink/25',
          fill && 'absolute inset-0',
          className
        )}
        style={fill ? style : { width, height, ...style }}
      >
        <ImageOff size={fill ? 22 : Math.min(Number(width) || 24, 24)} strokeWidth={1.3} />
      </div>
    )
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      quality={cloudinary ? undefined : 80}
      unoptimized={cloudinary}
      sizes={defaultSizes}
      className={className}
      style={style}
      onError={() => setErrored(true)}
      {...(shimmer
        ? ({ placeholder: 'blur', blurDataURL: blurSrc ?? SHIMMER_DATA_URL } as Partial<ImageProps>)
        : {})}
      {...rest}
    />
  )
}
