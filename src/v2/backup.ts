import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'
import { createSdk } from '@radio4000/sdk'
import type { Env } from '../config'

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const slug = c.req.query('slug')

  if (!slug) {
    return c.json(
      {
        message: 'Missing parameter `?slug=` for a channel slug',
      },
      404,
    )
  }

  try {
    const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    const sdk = createSdk(supabase)

    const { data: channel, error: channelError } = await sdk.channels.readChannel(slug)
    if (channelError) throw channelError

    const tracksResult = await sdk.channels.readChannelTracks(slug)
    if ('error' in tracksResult && tracksResult.error) throw tracksResult.error
    const tracks = 'data' in tracksResult ? tracksResult.data : []

    return c.json({ channel, tracks })
  } catch (error) {
    console.error(error)
    return c.json(
      {
        error: `Failed to back up @${slug}`,
      },
      500,
    )
  }
})

export default app
