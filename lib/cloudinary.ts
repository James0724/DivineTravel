import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

// ─── Folder constants ────────────────────────────────────────────────────────

export const CLOUDINARY_FOLDERS = {
  // New structured folders (usage-based)
  safariPackages: 'web_images/safaripackages',
  blog:           'web_images/blog',
  portfolio:      'web_images/portfolio',
  team:           'web_images/team',
  misc:           'web_images/misc',
  accommodations: 'web_images/accommodations',
  // Legacy (kept for backward compatibility)
  safaris:     (slug: string) => `divine-travel-nest-safaris/safaris/${slug}`,
  testimonials:'divine-travel-nest-safaris/testimonials',
} as const

export type ImageUsage = 'safari-cover' | 'safari-gallery' | 'blog-cover' | 'portfolio' | 'team' | 'misc' | 'accommodation-cover' | 'accommodation-gallery'

export function usageToFolder(usage: ImageUsage): string {
  switch (usage) {
    case 'safari-cover':
    case 'safari-gallery':
      return CLOUDINARY_FOLDERS.safariPackages
    case 'blog-cover':
      return CLOUDINARY_FOLDERS.blog
    case 'portfolio':
      return CLOUDINARY_FOLDERS.portfolio
    case 'team':
      return CLOUDINARY_FOLDERS.team
    case 'accommodation-cover':
    case 'accommodation-gallery':
      return CLOUDINARY_FOLDERS.accommodations
    default:
      return CLOUDINARY_FOLDERS.misc
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
}

// ─── Upload helpers ──────────────────────────────────────────────────────────

export async function uploadImage(
  fileBuffer: Buffer | string,
  folder: string,
  options?: Record<string, unknown>
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image' as const,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      ...options,
    }

    const uploadCallback = (
      error: unknown,
      result: Record<string, unknown> | undefined
    ) => {
      if (error) return reject(error as Error)
      if (!result) return reject(new Error('No upload result'))
      resolve({
        url:      result.secure_url as string,
        publicId: result.public_id as string,
        width:    result.width as number,
        height:   result.height as number,
        format:   result.format as string,
      })
    }

    if (typeof fileBuffer === 'string') {
      cloudinary.uploader.upload(fileBuffer, uploadOptions, uploadCallback)
    } else {
      const stream = cloudinary.uploader.upload_stream(uploadOptions, uploadCallback)
      stream.end(fileBuffer)
    }
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export async function deleteFolder(folder: string): Promise<void> {
  await cloudinary.api.delete_resources_by_prefix(folder)
  await cloudinary.api.delete_folder(folder)
}

export interface RenameResult {
  publicId: string
  url: string
}

/** Rename a Cloudinary asset preserving its folder path. */
export async function renameImage(fromPublicId: string, rawName: string): Promise<RenameResult> {
  const safe = rawName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_.]/g, '')
  if (!safe) throw new Error('Invalid name — use letters, numbers, hyphens or underscores only')

  const folder = fromPublicId.includes('/')
    ? fromPublicId.split('/').slice(0, -1).join('/')
    : ''
  const toPublicId = folder ? `${folder}/${safe}` : safe

  if (toPublicId === fromPublicId) return { publicId: fromPublicId, url: '' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await cloudinary.uploader.rename(fromPublicId, toPublicId, { overwrite: false })
  return { publicId: result.public_id as string, url: result.secure_url as string }
}

export function buildImageUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
    format?: string
  }
): string {
  return cloudinary.url(publicId, {
    secure:       true,
    quality:      options?.quality ?? 'auto',
    fetch_format: options?.format ?? 'auto',
    ...(options?.width  && { width:  options.width }),
    ...(options?.height && { height: options.height }),
    ...(options?.crop   && { crop:   options.crop }),
  })
}

export default cloudinary
