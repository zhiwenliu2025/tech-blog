import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { JSDOM } from 'jsdom'
import DOMPurifyFactory from 'dompurify'
import TurndownService from 'turndown'
import { getAdapter } from '~/server/utils/import-adapters'
import {
  validateUrl,
  checkRateLimit,
  processAllImages,
  appendSourceAttribution,
  checkContentSize
} from '~/server/utils/import-utils'
import type { ImportResult } from '~/server/utils/import-utils'

const FETCH_TIMEOUT = 30000 // 30 seconds

/**
 * POST /api/import/fetch
 * Fetch and parse an external blog article
 */
export default defineEventHandler(async event => {
  // 1. Authenticate user
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '请先登录'
    })
  }

  // 获取用户ID（兼容 id 和 sub 属性）
  const userId = user.id || (user as any).sub
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: '无法获取用户ID'
    })
  }

  // 2. Check rate limit
  const rateCheck = checkRateLimit(userId)
  if (!rateCheck.allowed) {
    throw createError({
      statusCode: 429,
      message: '导入次数超过限制，请稍后再试（每小时最多 10 次）'
    })
  }

  // 3. Parse and validate request body
  const body = await readBody<{ url: string }>(event)
  if (!body?.url) {
    throw createError({
      statusCode: 400,
      message: '请提供文章 URL'
    })
  }

  const urlValidation = validateUrl(body.url)
  if (!urlValidation.valid) {
    throw createError({
      statusCode: 400,
      message: urlValidation.error || '无效的 URL'
    })
  }

  try {
    // 4. Fetch the page HTML
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

    let response: Response
    try {
      response = await fetch(body.url, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        }
      })
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      throw createError({
        statusCode: 502,
        message: `无法获取页面内容 (HTTP ${response.status})`
      })
    }

    const html = await response.text()

    if (!html || html.length < 100) {
      throw createError({
        statusCode: 422,
        message: '页面内容为空或过短'
      })
    }

    // 5. Sanitize HTML with DOMPurify (server-side using jsdom window)
    const purifyWindow = new JSDOM('').window

    const DOMPurify = DOMPurifyFactory(purifyWindow as any)
    const cleanHtml = DOMPurify.sanitize(html, {
      WHOLE_DOCUMENT: true,
      ALLOWED_TAGS: [
        'html',
        'head',
        'body',
        'meta',
        'title',
        'link',
        'article',
        'section',
        'div',
        'span',
        'p',
        'br',
        'hr',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'ul',
        'ol',
        'li',
        'dl',
        'dt',
        'dd',
        'strong',
        'b',
        'em',
        'i',
        'u',
        's',
        'del',
        'ins',
        'a',
        'img',
        'figure',
        'figcaption',
        'table',
        'thead',
        'tbody',
        'tfoot',
        'tr',
        'th',
        'td',
        'pre',
        'code',
        'blockquote',
        'cite',
        'time',
        'mark',
        'sub',
        'sup',
        'abbr',
        'nav',
        'header',
        'footer',
        'main',
        'aside'
      ],
      ALLOWED_ATTR: [
        'href',
        'src',
        'alt',
        'title',
        'class',
        'id',
        'name',
        'content',
        'property',
        'rel',
        'type',
        'charset',
        'datetime',
        'width',
        'height',
        'data-src',
        'data-original',
        'data-lazy-src',
        'data-actualsrc',
        'colspan',
        'rowspan',
        'scope'
      ],
      ALLOW_DATA_ATTR: true
    })

    // 6. Extract content using adapter
    const adapter = getAdapter(body.url)
    const extracted = await adapter.extract(cleanHtml, body.url)

    if (!extracted.title && !extracted.content) {
      throw createError({
        statusCode: 422,
        message: '无法从页面中提取文章内容'
      })
    }

    // 7. Convert HTML to Markdown using Turndown
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
      emDelimiter: '*'
    })

    // Custom rule: preserve code blocks with language
    turndownService.addRule('codeBlock', {
      filter: (node: HTMLElement) => {
        return node.nodeName === 'PRE' && node.querySelector('code') !== null
      },
      replacement: (_content: string, node: HTMLElement) => {
        const codeElement = node.querySelector('code')
        if (!codeElement) return _content

        // Extract language from class (e.g., "language-javascript", "hljs language-python")
        let language = ''
        const classList = codeElement.className || ''
        const langMatch = classList.match(/(?:language-|lang-)(\w+)/)
        if (langMatch && langMatch[1]) {
          language = langMatch[1]
        }

        const code = codeElement.textContent || ''
        return `\n\n\`\`\`${language}\n${code.replace(/^\n+|\n+$/g, '')}\n\`\`\`\n\n`
      }
    })

    // Custom rule: preserve inline code
    turndownService.addRule('inlineCode', {
      filter: (node: HTMLElement) => {
        return (
          node.nodeName === 'CODE' && (!node.parentElement || node.parentElement.nodeName !== 'PRE')
        )
      },
      replacement: (_content: string, node: HTMLElement) => {
        const code = node.textContent || ''
        if (code.includes('`')) {
          return `\`\` ${code} \`\``
        }
        return `\`${code}\``
      }
    })

    // Custom rule: preserve LaTeX math (don't convert $...$ and $$...$$)
    turndownService.addRule('latexInline', {
      filter: (node: HTMLElement) => {
        return node.classList?.contains('math-inline') || node.classList?.contains('katex')
      },
      replacement: (_content: string, node: HTMLElement) => {
        return node.textContent || ''
      }
    })

    let markdown = turndownService.turndown(extracted.content)

    // Check content size
    if (!checkContentSize(markdown)) {
      throw createError({
        statusCode: 413,
        message: '文章内容过大（超过 1MB），无法导入'
      })
    }

    // 8. Process images (download & upload to Supabase)
    const supabase = await serverSupabaseClient(event)
    const { content: processedContent, report: imageReport } = await processAllImages(
      markdown,
      body.url,
      userId,
      supabase
    )
    markdown = processedContent

    // Process cover image
    let coverImage: string | null = extracted.coverImage || null
    if (coverImage && !coverImage.includes('supabase')) {
      try {
        const { processAllImages: processCovers } = await import('~/server/utils/import-utils')
        const coverMarkdown = `![cover](${coverImage})`
        const { content: processedCover } = await processCovers(
          coverMarkdown,
          body.url,
          userId,
          supabase
        )
        const coverMatch = processedCover.match(/!\[cover\]\(([^)]+)\)/)
        if (coverMatch && coverMatch[1]) {
          coverImage = coverMatch[1]
        }
      } catch {
        // Keep original cover URL as fallback
      }
    }

    // 9. Append source attribution
    markdown = appendSourceAttribution(
      markdown,
      extracted.title,
      body.url,
      extracted.author || null
    )

    // 10. Generate excerpt (first 200 chars of plain text)
    const excerpt =
      markdown
        .replace(/[#*`\[\]()>_~\-|]/g, '') // Remove markdown syntax
        .replace(/\n+/g, ' ')
        .trim()
        .substring(0, 200) + '...'

    // 11. Return structured result
    const result: ImportResult = {
      title: extracted.title,
      content: markdown,
      excerpt,
      coverImage,
      sourceUrl: body.url,
      sourceSiteName: extracted.siteName,
      author: extracted.author || null,
      publishedAt: extracted.publishedAt || null,
      tags: extracted.tags || [],
      images: imageReport
    }

    return result
  } catch (err: any) {
    // Re-throw Nuxt errors
    if (err.statusCode) {
      throw err
    }

    console.error('Import error:', err)
    throw createError({
      statusCode: 500,
      message: err.message || '导入失败，请稍后重试'
    })
  }
})
