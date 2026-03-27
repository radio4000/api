import {describe, it, expect, beforeAll} from 'vitest'

const BASE_URL = process.env.API_URL || 'https://api.radio4000.com'
const TEST_SLUG = 'ko002'
const TEST_YOUTUBE_ID = 'ho4wlwpQDEE' // Smith & Mighty - Anyone (from ko002)
const NONEXISTENT_SLUG = 'nonexistent-channel-xyz-99999'

// Detect environment: local dev vs deployed (preview/live)
const isLocal = BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1')

// Detect if YouTube API key is configured before tests run
const hasYoutubeKey = await fetch(`${BASE_URL}/api/youtube?id=${TEST_YOUTUBE_ID}`).then(r => r.status === 200)

beforeAll(() => {
  console.log(`Testing API at: ${BASE_URL}`)
  console.log(`Environment: ${isLocal ? 'local' : 'deployed'}`)
  console.log(`YouTube API key: ${hasYoutubeKey ? 'available' : 'missing (skipping YouTube tests)'}`)
})

describe('Radio4000 API', () => {
  describe('CORS', () => {
    it('returns CORS headers on responses', async () => {
      const res = await fetch(`${BASE_URL}/api/`)
      expect(res.headers.get('access-control-allow-origin')).toBe('*')
    })

    it('handles OPTIONS preflight requests', async () => {
      const res = await fetch(`${BASE_URL}/api/`, {method: 'OPTIONS'})
      expect(res.headers.get('access-control-allow-origin')).toBe('*')
      expect(res.headers.get('access-control-allow-methods')).toContain('GET')
    })
  })

  // The root URL serves the Next.js website on production,
  // but the Hono API JSON on local dev.
  describe('GET /', () => {
    it.skipIf(!isLocal)('returns API info at root', async () => {
      const res = await fetch(`${BASE_URL}/`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.message).toContain('Welcome to the Radio4000 API')
      expect(data.api).toBeDefined()
    })
  })

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

    it('sanitizes slug to prevent XSS', async () => {
      const res = await fetch(`${BASE_URL}/api/embed?slug=<script>alert(1)</script>`)
      // Should either 404 (empty after sanitization) or return safe HTML
      const text = await res.text()
      expect(text).not.toContain('<script>alert(1)</script>')
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
      expect(data.width).toBeTypeOf('number')
      expect(data.height).toBeTypeOf('number')
    })

    it('returns error for non-existent channel', async () => {
      const res = await fetch(`${BASE_URL}/api/oembed?slug=${NONEXISTENT_SLUG}`)
      expect([404, 500]).toContain(res.status)
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
      // Channel shape
      expect(data.channel).toBeDefined()
      expect(data.channel.slug).toBe(TEST_SLUG)
      expect(data.channel.id).toBeTypeOf('string')
      expect(data.channel.name).toBeTypeOf('string')
      expect(data.channel.created_at).toBeTypeOf('string')

      // Tracks array with real data
      expect(data.tracks).toBeDefined()
      expect(Array.isArray(data.tracks)).toBe(true)
      expect(data.tracks.length).toBeGreaterThan(0)

      // Verify track shape on first track
      const track = data.tracks[0]
      expect(track.id).toBeTypeOf('string')
      expect(track.title).toBeTypeOf('string')
      expect(track.url).toBeTypeOf('string')
      expect(track.created_at).toBeTypeOf('string')

      // Followers and followings (top-level, from SDK)
      expect(data.followers).toBeDefined()
      expect(Array.isArray(data.followers)).toBe(true)
      expect(data.followings).toBeDefined()
      expect(Array.isArray(data.followings)).toBe(true)
    })

    it('returns error for non-existent channel', async () => {
      const res = await fetch(`${BASE_URL}/api/backup?slug=${NONEXISTENT_SLUG}`)
      expect([404, 500]).toContain(res.status)
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
      expect(html.toLowerCase()).toContain('<!doctype html>')
      expect(html).toMatch(/r4-app|r4-player/)
    })

    it('sanitizes slug to prevent XSS', async () => {
      const res = await fetch(`${BASE_URL}/api/v2/embed?slug=<script>alert(1)</script>`)
      const text = await res.text()
      expect(text).not.toContain('<script>alert(1)</script>')
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
      // Channel shape
      expect(data.channel).toBeDefined()
      expect(data.channel.slug).toBe(TEST_SLUG)
      expect(data.channel.id).toBeTypeOf('string')
      expect(data.channel.name).toBeTypeOf('string')
      expect(data.channel.created_at).toBeTypeOf('string')

      // Tracks array with real data
      expect(data.tracks).toBeDefined()
      expect(Array.isArray(data.tracks)).toBe(true)
      expect(data.tracks.length).toBeGreaterThan(0)

      // Verify track shape on first track
      const track = data.tracks[0]
      expect(track.id).toBeTypeOf('string')
      expect(track.title).toBeTypeOf('string')
      expect(track.url).toBeTypeOf('string')
      expect(track.created_at).toBeTypeOf('string')

      // Followers and followings (top-level, from SDK)
      expect(data.followers).toBeDefined()
      expect(Array.isArray(data.followers)).toBe(true)
      expect(data.followings).toBeDefined()
      expect(Array.isArray(data.followings)).toBe(true)
    })

    it('returns error for non-existent channel', async () => {
      const res = await fetch(`${BASE_URL}/api/v2/backup?slug=${NONEXISTENT_SLUG}`)
      expect([404, 500]).toContain(res.status)
    })
  })

  describe('GET /api/youtube', () => {
    it('returns error without id', async () => {
      const res = await fetch(`${BASE_URL}/api/youtube`)
      expect(res.status).toBe(500)
    })

    it.skipIf(!hasYoutubeKey)('returns 404 for non-existent video', async () => {
      const res = await fetch(`${BASE_URL}/api/youtube?id=xxxxxxxxxxx`)
      expect(res.status).toBe(404)
    })

    it.skipIf(!hasYoutubeKey)('returns video data with valid id', async () => {
      const res = await fetch(`${BASE_URL}/api/youtube?id=${TEST_YOUTUBE_ID}`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.id).toBe(TEST_YOUTUBE_ID)
      expect(data.title).toBeTypeOf('string')
      expect(data.url).toContain('youtube.com')
      expect(data.duration).toBeTypeOf('string')
      expect(data.thumbnails).toBeTypeOf('object')
    })
  })

  describe('GET /api/search-youtube', () => {
    it('returns error without query', async () => {
      const res = await fetch(`${BASE_URL}/api/search-youtube`)
      expect([400, 500]).toContain(res.status)
    })

    it.skipIf(!hasYoutubeKey)('returns search results with query', async () => {
      const res = await fetch(`${BASE_URL}/api/search-youtube?query=jazz`)
      expect(res.status).toBe(200)

      const data = await res.json()
      expect(data.query).toBe('jazz')
      expect(data.videos).toBeDefined()
      expect(Array.isArray(data.videos)).toBe(true)
      expect(data.videos.length).toBeGreaterThan(0)

      // Verify video result shape
      const video = data.videos[0]
      expect(video.id).toBeTypeOf('string')
      expect(video.title).toBeTypeOf('string')
      expect(video.viewCount).toBeTypeOf('number')
    })
  })

  describe('404 handler', () => {
    it('returns 404 for unknown routes', async () => {
      const res = await fetch(`${BASE_URL}/api/unknown-route-xyz`)
      expect(res.status).toBe(404)
    })

    it('returns JSON body on 404', async () => {
      const res = await fetch(`${BASE_URL}/api/unknown-route-xyz`)
      const data = await res.json()
      expect(data.message).toBeTypeOf('string')
      expect(data.message.toLowerCase()).toContain('not found')
    })
  })
})
