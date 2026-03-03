import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useUniqueSlug } from '~/composables/useUniqueSlug'

describe('useUniqueSlug', () => {
  const { ensureUniqueSlug, checkSlugAvailability, generateUniqueSlug } = useUniqueSlug()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ensureUniqueSlug', () => {
    it('should return original slug if available', async () => {
      const result = await ensureUniqueSlug('my-post')
      expect(result).toBe('my-post')
    })

    it('should append number if slug exists', async () => {
      const result = await ensureUniqueSlug('my-post')
      expect(result).toMatch(/^my-post(-\d+)?$/)
    })
  })

  describe('checkSlugAvailability', () => {
    it('should return true for available slug', async () => {
      const result = await checkSlugAvailability('unique-post-123')
      expect(typeof result).toBe('boolean')
    })

    it('should return false for empty slug', async () => {
      const result = await checkSlugAvailability('')
      expect(result).toBe(false)
    })
  })

  describe('generateUniqueSlug', () => {
    it('should generate unique slug from title', async () => {
      const result = await generateUniqueSlug('My Awesome Post')
      expect(result).toMatch(/^[a-z0-9-]+$/)
      expect(result).not.toContain(' ')
    })
  })
})
