import { Hono } from 'hono'
import type { Env } from './config'

const app = new Hono<{ Bindings: Env }>()

interface VideoSearchResult {
  id: string
  title: string
  viewCount: number
}

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string }
    snippet: { title: string }
  }>
}

interface YouTubeVideosResponse {
  items: Array<{
    id: string
    statistics?: { viewCount?: string }
  }>
}

app.get('/', async (c) => {
  const query = c.req.query('query')

  if (!query) {
    return c.json({ error: 'missing ?query' }, 400)
  }

  try {
    const YOUTUBE_API_KEY = c.env.YOUTUBE_API_KEY

    // First request: search for videos
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('maxResults', '10')
    searchUrl.searchParams.set('q', query)
    searchUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const searchResponse = await fetch(searchUrl.toString())

    if (!searchResponse.ok) {
      return c.json({ error: 'Failed to search YouTube' }, 500)
    }

    const searchData = await searchResponse.json() as YouTubeSearchResponse

    // Extract video IDs from search results
    const videoIds = searchData.items.map((item) => item.id.videoId)

    if (videoIds.length === 0) {
      return c.json({ query, videos: [] })
    }

    // Second request: get statistics for videos
    const statsUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
    statsUrl.searchParams.set('part', 'statistics')
    statsUrl.searchParams.set('id', videoIds.join(','))
    statsUrl.searchParams.set('key', YOUTUBE_API_KEY)

    const statsResponse = await fetch(statsUrl.toString())

    if (!statsResponse.ok) {
      return c.json({ error: 'Failed to fetch video statistics' }, 500)
    }

    const statsData = await statsResponse.json() as YouTubeVideosResponse

    // Build videos array with combined data
    const videoStats = new Map(
      statsData.items.map((item) => [item.id, item.statistics?.viewCount || '0'])
    )

    const videos: VideoSearchResult[] = searchData.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      viewCount: parseInt(videoStats.get(item.id.videoId) || '0', 10),
    }))

    return c.json({ query, videos }, 200)
  } catch (error) {
    console.error('YouTube search error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

export default app
