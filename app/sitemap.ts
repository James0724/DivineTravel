import type { MetadataRoute } from 'next'
import connectDB from '@/lib/db/mongoose'
import PostModel from '@/lib/db/models/Post'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://divinetravelnestsafaris.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: APP_URL,                                          lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${APP_URL}/safaris`,                             lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${APP_URL}/safaris/kenya`,                       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.88 },
    { url: `${APP_URL}/safaris/tanzania`,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.88 },
    { url: `${APP_URL}/safaris/uganda`,                      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.88 },
    { url: `${APP_URL}/safaris/cross-country-safaris`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.82 },
    { url: `${APP_URL}/blog`,                                lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${APP_URL}/destinations/kenya`,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${APP_URL}/destinations/tanzania`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${APP_URL}/destinations/uganda`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.75 },
    { url: `${APP_URL}/contact`,                             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${APP_URL}/about`,                               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    await connectDB()
    const posts = await PostModel.find({ published: true }).select('slug updatedAt').lean()

    const blogRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
      url:             `${APP_URL}/blog/${p.slug}`,
      lastModified:    new Date(p.updatedAt),
      changeFrequency: 'monthly',
      priority:        0.7,
    }))

    return [...staticRoutes, ...blogRoutes]
  } catch {
    return staticRoutes
  }
}
