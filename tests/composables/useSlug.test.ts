import { describe, it, expect } from 'vitest'
import { useSlug } from '~/composables/useSlug'

describe('useSlug', () => {
  const { generateSlug, generateSlugFromTitle, isValidSlug } = useSlug()

  describe('generateSlug', () => {
    it('should generate slug from English text', () => {
      const result = generateSlug('Hello World')
      expect(result).toBe('hello-world')
    })

    it('should handle special characters', () => {
      const result = generateSlug('Hello, World! How are you?')
      expect(result).toBe('hello-world-how-are-you')
    })

    it('should handle multiple spaces and hyphens', () => {
      const result = generateSlug('Hello   World---Test')
      expect(result).toBe('hello-world-test')
    })

    it('should limit length to maxLength', () => {
      const result = generateSlug('This is a very long title that should be truncated', {
        maxLength: 20
      })
      expect(result.length).toBeLessThanOrEqual(20)
    })

    it('should handle Chinese characters', () => {
      const result = generateSlug('你好世界')
      expect(result).toBe('你好世界')
    })

    it('should handle mixed English and Chinese', () => {
      const result = generateSlug('Hello 你好 World')
      expect(result).toBe('hello-你好-world')
    })

    it('should return "untitled" for empty string', () => {
      const result = generateSlug('')
      expect(result).toBe('untitled')
    })

    it('should use custom separator', () => {
      const result = generateSlug('Hello World', { separator: '_' })
      expect(result).toBe('hello_world')
    })

    it('should preserve case when lowercase is false', () => {
      const result = generateSlug('Hello World', { lowercase: false })
      expect(result).toBe('Hello-World')
    })
  })

  describe('generateSlugFromTitle', () => {
    it('should generate slug with default options', () => {
      const result = generateSlugFromTitle('My Awesome Blog Post')
      expect(result).toBe('my-awesome-blog-post')
    })

    it('should limit to 80 characters', () => {
      const longTitle =
        'This is a very long blog post title that exceeds the maximum length limit of 80 characters and should be truncated appropriately'
      const result = generateSlugFromTitle(longTitle)
      expect(result.length).toBeLessThanOrEqual(80)
    })
  })

  describe('isValidSlug', () => {
    it('should validate correct slug', () => {
      expect(isValidSlug('hello-world')).toBe(true)
      expect(isValidSlug('my-awesome-post-123')).toBe(true)
      expect(isValidSlug('你好世界')).toBe(true)
    })

    it('should reject invalid slug', () => {
      expect(isValidSlug('')).toBe(false)
      expect(isValidSlug('hello world')).toBe(false)
      expect(isValidSlug('hello_world')).toBe(false)
      expect(isValidSlug('hello!world')).toBe(false)
      expect(isValidSlug('hello--world')).toBe(false)
      expect(isValidSlug('-hello')).toBe(false)
      expect(isValidSlug('hello-')).toBe(false)
    })
  })
})
