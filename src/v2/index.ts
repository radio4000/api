import { Hono } from 'hono'
import type { Env } from '../config'

const app = new Hono<{ Bindings: Env }>()

app.get('/', (c) => {
	const channelSlug = c.req.query('channelSlug') ?? '{channel-slug}'
	const baseUrl = new URL(c.req.url).origin

	return c.json({
		message: 'Welcome to the Radio4000 V2 API (this endpoint is for humans)',
		v2: {
			channelBackup: `${baseUrl}/api/v2/backup?slug=${channelSlug}`,
			channelEmbedUrl: `${baseUrl}/api/v2/embed?slug=${channelSlug}`,
		},
	})
})

export default app
