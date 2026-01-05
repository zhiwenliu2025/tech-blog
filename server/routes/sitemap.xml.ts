import type { Database } from '~/types/database.types'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async event => {
  const config = useRuntimeConfig()

  const baseUrl = (config.public.appUrl || 'http://localhost:3000').replace(/\/+$/, '')

  // 静态页面路由
  const staticPaths = [
    '/',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/my-blogs',
    '/authors',
    '/profile'
  ]

  type UrlEntry = {
    loc: string
    lastmod?: string
    changefreq?: string
    priority?: string
  }

  const urls: UrlEntry[] = staticPaths.map(path => ({
    loc: `${baseUrl}${path}`,
    changefreq: 'weekly',
    priority: path === '/' ? '1.0' : '0.8'
  }))

  // 动态文章路由
  try {
    // 使用 Nuxt Supabase 服务端客户端，避免额外的 ESM 加载问题
    const supabase = await serverSupabaseClient<Database>(event)

    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at')
      .eq('published', true)

    if (posts && Array.isArray(posts)) {
      for (const post of posts as {
        slug: string
        updated_at: string | null
        created_at: string
      }[]) {
        urls.push({
          loc: `${baseUrl}/blog/${post.slug}`,
          lastmod: (post.updated_at || post.created_at)?.split('T')[0],
          changefreq: 'weekly',
          priority: '0.9'
        })
      }
    }
  } catch (e) {
    // 静默失败：即使 Supabase 失败也要返回基础 sitemap
    console.error('Failed to generate dynamic sitemap entries:', e)
  }

  const sitemapEntries = urls
    .map(url => {
      return `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority ? `<priority>${url.priority}</priority>` : ''}
  </url>`
    })
    .join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return sitemap
})
