export function useSlug() {
  const generateSlug = (
    text: string,
    options: {
      maxLength?: number
      separator?: string
      lowercase?: boolean
      removeStopWords?: boolean
    } = {}
  ): string => {
    const { maxLength = 100, separator = '-', lowercase = true, removeStopWords = false } = options

    if (!text || text.trim().length === 0) {
      return 'untitled'
    }

    let slug = text

    if (lowercase) {
      slug = slug.toLowerCase()
    }

    slug = slug.replace(/[^\w\s\u4e00-\u9fa5-]/g, '')

    if (removeStopWords) {
      const stopWords = [
        'a',
        'an',
        'the',
        'and',
        'or',
        'but',
        'in',
        'on',
        'at',
        'to',
        'for',
        'of',
        'with',
        'by',
        '的',
        '了',
        '和',
        '是',
        '在',
        '我',
        '有',
        '就',
        '不',
        '人',
        '都',
        '一',
        '一个',
        '上',
        '也',
        '很',
        '到',
        '说',
        '要',
        '去',
        '你',
        '会',
        '着',
        '没有',
        '看',
        '好',
        '自己',
        '这'
      ]
      const words = slug.split(separator)
      slug = words.filter(word => !stopWords.includes(word)).join(separator)
    }

    slug = slug.replace(/[\s_]+/g, separator).replace(/-+/g, separator)

    slug = slug.trim()

    if (slug.length > maxLength) {
      slug = slug.substring(0, maxLength).trim()
      const lastDash = slug.lastIndexOf(separator)
      if (lastDash > maxLength * 0.7) {
        slug = slug.substring(0, lastDash)
      }
    }

    return slug || 'untitled'
  }

  const generateSlugFromTitle = (title: string): string => {
    return generateSlug(title, {
      maxLength: 80,
      separator: '-',
      lowercase: true,
      removeStopWords: false
    })
  }

  const isValidSlug = (slug: string): boolean => {
    if (!slug || slug.trim().length === 0) {
      return false
    }
    const slugRegex = /^[a-z0-9\u4e00-\u9fa5]+(?:-[a-z0-9\u4e00-\u9fa5]+)*$/
    return slugRegex.test(slug)
  }

  return {
    generateSlug,
    generateSlugFromTitle,
    isValidSlug
  }
}
