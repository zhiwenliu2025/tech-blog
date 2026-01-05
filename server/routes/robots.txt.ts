export default defineEventHandler(event => {
  const config = useRuntimeConfig()
  const baseUrl = (config.public.appUrl || 'http://localhost:3000').replace(/\/+$/, '')

  const lines = [
    'User-Agent: *',
    'Disallow:',
    '',
    // 提示搜索引擎 sitemap 地址
    `Sitemap: ${baseUrl}/sitemap.xml`
  ]

  const body = lines.join('\n')

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return body
})
