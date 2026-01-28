import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'
import { createSdk } from '@radio4000/sdk'
import type { Env } from './config'

const RADIO4000_APP_ICON_URL = 'https://assets.radio4000.com/icon-r4.svg'

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const slug = c.req.query('slug')

  if (!slug) {
    return c.json({
      message: 'Missing parameter ?slug=',
    }, 404)
  }

  // Initialize SDK client
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  const sdk = createSdk(supabase)

  let channel
  try {
    const { data, error } = await sdk.channels.readChannel(slug)
    if (error) throw error
    channel = data
  } catch (error) {
    console.error(error)
    return c.json({
      message: `Could not fetch channel @${slug}`,
      code: 500,
      internalError: error instanceof Error ? error.message : String(error),
    }, 500)
  }

  if (!channel) {
    return c.json({
      message: `Requested channel @${slug} does not exist`,
    }, 404)
  }

  const embedHtml = getOEmbed(channel, c)
  return c.json(embedHtml)
})

interface Channel {
  slug: string
  name: string
  description: string | null
  image: string | null
}

const getOEmbed = (channel: Channel, c: { env: Env; req: { url: string } }) => {
  const { slug, name: title, description: body = '', image } = channel
  const cloudinaryUrl = c.env.CLOUDINARY_URL
  const cmsUrl = c.env.RADIO4000_URL
  const requestOrigin = new URL(c.req.url).origin
  const apiUrl = requestOrigin

  let thumbnailUrl
  if (cloudinaryUrl && image) {
    thumbnailUrl = `${cloudinaryUrl}/w_500,h_500,c_thumb,q_60,fl_lossy/${image}`
  } else {
    thumbnailUrl = RADIO4000_APP_ICON_URL
  }

  // Simple XSS prevention: remove non-alphanumeric and hyphens
  const safeSlug = slug.replace(/[^a-zA-Z0-9-]/g, '')

  return {
    version: '1.0',
    type: 'rich',
    provider_name: 'Radio4000',
    provider_url: cmsUrl,
    author_name: title,
    author_url: `${cmsUrl}/${safeSlug}`,
    title: title,
    description: body,
    thumbnail_url: thumbnailUrl,
    html: `<iframe width="320" height="500" src="${apiUrl}/api/embed?slug=${safeSlug}" frameborder="0"></iframe>`,
    width: 320,
    height: 500,
  }
}

export default app
