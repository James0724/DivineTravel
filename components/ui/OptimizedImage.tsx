import Image, { type ImageProps } from 'next/image'

type OmittedProps = 'src' | 'placeholder' | 'blurDataURL'

interface OptimizedImageProps extends Omit<ImageProps, OmittedProps> {
  src: string
  /** Show a blur-up shimmer while loading (default true) */
  shimmer?: boolean
}

/**
 * Generates a tiny Cloudinary placeholder URL for the blur-up effect.
 * Returns undefined for non-Cloudinary sources (falls back to shimmer).
 */
function cloudinaryBlurUrl(src: string): string | undefined {
  if (!src.includes('res.cloudinary.com')) return undefined
  return src.replace('/upload/', '/upload/w_20,q_10,e_blur:500,f_auto/')
}

// Neutral warm-grey fill — matches the site's --bg-soft tone
const SHIMMER_DATA_URL =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect fill='%23e8e2d9'/%3E%3C/svg%3E"

/**
 * Drop-in replacement for next/image with:
 * - automatic blur-up placeholder (Cloudinary LQIP or warm-grey shimmer)
 * - sensible default quality (80) and sizes for fill images
 * - zero-config for the most common usage patterns
 *
 * @example
 * // fill layout (inside a positioned container)
 * <OptimizedImage src={url} alt="..." fill className="object-cover" />
 *
 * // fixed dimensions
 * <OptimizedImage src={url} alt="..." width={800} height={600} />
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
  quality,
  className,
  style,
  ...rest
}: OptimizedImageProps) {
  const blurSrc = cloudinaryBlurUrl(src)

  const placeholderProps =
    shimmer
      ? ({
          placeholder: 'blur',
          blurDataURL: blurSrc ?? SHIMMER_DATA_URL,
        } as Partial<ImageProps>)
      : {}

  const defaultSizes =
    sizes ??
    (fill ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : undefined)

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      quality={quality ?? 80}
      sizes={defaultSizes}
      className={className}
      style={style}
      {...placeholderProps}
      {...rest}
    />
  )
}
