export default defineEventHandler(event => {
  const config = useRuntimeConfig()
  const baseUrl = (config.public.appUrl || 'http://localhost:3000').replace(/\/+$/, '')

  const lines = [
    'User-Agent: *',
    // 私有页面：需要登录才能访问，无需爬取
    'Disallow: /auth/',
    'Disallow: /my-blogs',
    'Disallow: /profile',
    // 编辑类页面：无需索引
    'Disallow: /blog/create',
    'Disallow: /blog/edit/',
    // API 路由
    'Disallow: /api/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`
  ]

  const body = lines.join('\n')

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return body
})
