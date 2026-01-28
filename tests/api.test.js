import {describe, it, expect, beforeAll} from 'vitest'

const BASE_URL = process.env.API_URL || 'https://api.radio4000.com'
const TEST_SLUG = 'oskar'

beforeAll(() => {
  console.log(`Testing API at: ${BASE_URL}`)
})

describe('Radio4000 API', () => {
  describe('GET /api/', () => {
    it('returns API info as JSON', async () => {
      const res = await fetch(`${BASE_URL}/api/`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.message).toContain('Welcome to the Radio4000 API')
      expect(data.api).toBeDefined()
      expect(data.api.url).toBeDefined()
    })
  })

  describe('GET /api/embed', () => {
    it('returns 404 without slug', async () => {
      const res = await fetch(`${BASE_URL}/api/embed`)
      expect(res.status).toBe(404)
    })

    it('returns HTML with valid slug', async () => {
      const res = await fetch(`${BASE_URL}/api/embed?slug=${TEST_SLUG}`)
      expect(res.status).toBe(200)

      const html = await res.text()
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('radio4000-player')
      expect(html).toContain(TEST_SLUG)
    })
  })

  describe('GET /api/oembed', () => {
    it('returns 404 without slug', async () => {
      const res = await fetch(`${BASE_URL}/api/oembed`)
      expect(res.status).toBe(404)
    })

    it('returns oEmbed JSON with valid slug', async () => {
      const res = await fetch(`${BASE_URL}/api/oembed?slug=${TEST_SLUG}`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.version).toBe('1.0')
      expect(data.type).toBe('rich')
      expect(data.provider_name).toBe('Radio4000')
      expect(data.author_url).toContain(TEST_SLUG)
      expect(data.html).toContain('iframe')
      expect(data.width).toBeDefined()
      expect(data.height).toBeDefined()
    })
  })

  describe('GET /api/backup', () => {
    it('returns 404 without slug', async () => {
      const res = await fetch(`${BASE_URL}/api/backup`)
      expect(res.status).toBe(404)
    })

    it('returns channel backup with valid slug', async () => {
      const res = await fetch(`${BASE_URL}/api/backup?slug=${TEST_SLUG}`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.channel).toBeDefined()
      expect(data.channel.slug).toBe(TEST_SLUG)
      expect(data.tracks).toBeDefined()
      expect(Array.isArray(data.tracks)).toBe(true)
    })
  })

  describe('GET /api/v2', () => {
    it('returns V2 API info', async () => {
      const res = await fetch(`${BASE_URL}/api/v2`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.message).toContain('V2')
    })
  })

  describe('GET /api/v2/embed', () => {
    it('returns 404 without slug', async () => {
      const res = await fetch(`${BASE_URL}/api/v2/embed`)
      expect(res.status).toBe(404)
    })

    it('returns HTML with valid slug', async () => {
      const res = await fetch(`${BASE_URL}/api/v2/embed?slug=${TEST_SLUG}`)
      expect(res.status).toBe(200)

      const html = await res.text()
      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('r4-app')
    })
  })

  describe('GET /api/v2/backup', () => {
    it('returns 404 without slug', async () => {
      const res = await fetch(`${BASE_URL}/api/v2/backup`)
      expect(res.status).toBe(404)
    })

    it('returns channel backup with valid slug', async () => {
      const res = await fetch(`${BASE_URL}/api/v2/backup?slug=${TEST_SLUG}`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.channel).toBeDefined()
      expect(data.channel.slug).toBe(TEST_SLUG)
      expect(data.tracks).toBeDefined()
      expect(Array.isArray(data.tracks)).toBe(true)
    })
  })

  describe('GET /api/youtube', () => {
    it('returns error without id', async () => {
      const res = await fetch(`${BASE_URL}/api/youtube`)
      expect(res.status).toBe(500)
    })

    it('returns 404 for non-existent video', async () => {
      const res = await fetch(`${BASE_URL}/api/youtube?id=xxxxxxxxxxx`)
      expect(res.status).toBe(404)
    })

    it('returns video data with valid id', async () => {
      const res = await fetch(`${BASE_URL}/api/youtube?id=dQw4w9WgXcQ`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.id).toBe('dQw4w9WgXcQ')
      expect(data.title).toBeDefined()
      expect(data.url).toContain('youtube.com')
    })
  })

  describe('GET /api/search-youtube', () => {
    it('returns 400 without query', async () => {
      const res = await fetch(`${BASE_URL}/api/search-youtube`)
      expect(res.status).toBe(400)
    })

    it('returns search results with query', async () => {
      const res = await fetch(`${BASE_URL}/api/search-youtube?query=jazz`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.query).toBe('jazz')
      expect(data.videos).toBeDefined()
      expect(Array.isArray(data.videos)).toBe(true)
    })
  })

  describe('404 handler', () => {
    it('returns 404 for unknown routes', async () => {
      const res = await fetch(`${BASE_URL}/api/unknown-route-xyz`)
      expect(res.status).toBe(404)
    })
  })
})
