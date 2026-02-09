import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'

export interface ExtractResult {
  title: string
  content: string // HTML format
  author?: string
  publishedAt?: string
  tags?: string[]
  coverImage?: string
  siteName: string
}

export interface ImportAdapter {
  /** Check if this adapter matches the URL */
  match(url: string): boolean
  /** Extract article content, returning richer info than generic approach */
  extract(html: string, url: string): Promise<ExtractResult>
}

/**
 * Base adapter using Mozilla Readability for generic content extraction.
 * Works as a fallback for any website.
 */
export class BaseAdapter implements ImportAdapter {
  match(_url: string): boolean {
    return true // Always matches as fallback
  }

  async extract(html: string, url: string): Promise<ExtractResult> {
    const dom = new JSDOM(html, { url })
    const document = dom.window.document

    // Handle lazy-loaded images before parsing
    this.processLazyImages(document)

    // Use Readability to extract main content
    const reader = new Readability(document)
    const article = reader.parse()

    if (!article) {
      throw new Error('无法提取文章内容，请检查 URL 是否指向文章页面')
    }

    // Extract cover image from og:image or first image
    const coverImage = this.extractCoverImage(dom.window.document, url)

    // Extract tags from meta keywords
    const tags = this.extractTags(dom.window.document)

    // Extract published time
    const publishedAt = this.extractPublishedTime(dom.window.document)

    return {
      title: article.title || '',
      content: article.content || '',
      author: article.byline || undefined,
      publishedAt,
      tags,
      coverImage,
      siteName: article.siteName || new URL(url).hostname
    }
  }

  /**
   * Process lazy-loaded images by replacing src with data attributes
   */
  protected processLazyImages(document: Document): void {
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      const lazyAttrs = ['data-src', 'data-original', 'data-lazy-src', 'data-actualsrc']
      for (const attr of lazyAttrs) {
        const value = img.getAttribute(attr)
        if (value) {
          img.setAttribute('src', value)
          break
        }
      }
    })
  }

  /**
   * Extract cover image from meta tags or first image
   */
  protected extractCoverImage(document: Document, baseUrl: string): string | undefined {
    // Try og:image
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content')
    if (ogImage) {
      try {
        return new URL(ogImage, baseUrl).href
      } catch {
        return ogImage
      }
    }

    // Try twitter:image
    const twitterImage = document
      .querySelector('meta[name="twitter:image"]')
      ?.getAttribute('content')
    if (twitterImage) {
      try {
        return new URL(twitterImage, baseUrl).href
      } catch {
        return twitterImage
      }
    }

    return undefined
  }

  /**
   * Extract tags from meta keywords
   */
  protected extractTags(document: Document): string[] {
    const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content')
    if (keywords) {
      return keywords
        .split(/[,，]/)
        .map(t => t.trim())
        .filter(t => t.length > 0 && t.length < 30)
        .slice(0, 10)
    }

    // Try article:tag
    const articleTags = document.querySelectorAll('meta[property="article:tag"]')
    if (articleTags.length > 0) {
      return Array.from(articleTags)
        .map(tag => tag.getAttribute('content') || '')
        .filter(t => t.length > 0)
        .slice(0, 10)
    }

    return []
  }

  /**
   * Extract published time from meta tags
   */
  protected extractPublishedTime(document: Document): string | undefined {
    // Try common meta tags
    const selectors = [
      'meta[property="article:published_time"]',
      'meta[name="publishdate"]',
      'meta[name="publish_date"]',
      'meta[name="date"]',
      'time[datetime]'
    ]

    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element) {
        const value = element.getAttribute('content') || element.getAttribute('datetime')
        if (value) {
          try {
            const date = new Date(value)
            if (!isNaN(date.getTime())) {
              return date.toISOString()
            }
          } catch {
            // ignore invalid dates
          }
        }
      }
    }

    return undefined
  }
}
