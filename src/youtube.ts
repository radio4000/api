import { Hono } from 'hono'
import type { Env } from './config'

const app = new Hono<{ Bindings: Env }>()

interface YouTubeResponse {
  items: YouTubeItem[]
}

interface YouTubeItem {
  id: string
  snippet: {
    title: string
    description: string
    thumbnails: Record<string, { url: string; width: number; height: number }>
    tags?: string[]
  }
  contentDetails: {
    duration: string
  }
  status: Record<string, unknown>
}

app.get('/', async (c) => {
  const { YOUTUBE_API_KEY } = c.env
  const id = c.req.query('id')

  try {
    if (!YOUTUBE_API_KEY) throw new Error('A YOUTUBE_KEY in your .env file is required')
    if (!id) throw new Error('A ytid query parameter is required')

    const url = `https://www.googleapis.com/youtube/v3/videos?part=status,contentDetails,snippet&id=${id}&key=${YOUTUBE_API_KEY}`
    const response = await fetch(url)
    const data = await response.json() as YouTubeResponse

    if (data.items.length === 0) return c.json({ message: 'YouTube video not found' }, 404)

    return c.json(serialize(data.items[0]), 200)
  } catch (err) {
    return c.json({ message: err instanceof Error ? err.message : 'Unknown error' }, 500)
  }
})

function serialize(item: YouTubeItem) {
  return {
    id: item.id,
    url: `https://www.youtube.com/watch?v=${item.id}`,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnails: item.snippet.thumbnails,
    tags: item.snippet.tags,
    duration: item.contentDetails.duration,
    status: item.status,
  }
}

export default app
