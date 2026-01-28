import { Hono } from 'hono'
import type { Env } from './config'

const app = new Hono<{ Bindings: Env }>()

const RADIO4000_REPO_URL = 'https://github.com/radio4000/api'
const RADIO4000_PLAYER_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/radio4000-player'
const RADIO4000_APP_ICON_URL = 'https://assets.radio4000.com/icon-r4.svg'

app.get('/', (c) => {
	const { channelSlug = '{channel-slug}', channelId = '{channel-id}', trackId = '{track-id}' } = c.req.query()

	const RADIO4000_CMS_URL = c.env.RADIO4000_URL
	const SUPABASE_URL = c.env.SUPABASE_URL
	const baseUrl = new URL(c.req.url).origin
	const RADIO4000_API_URL = `${baseUrl}/api`

	return c.json({
		message: 'Welcome to the Radio4000 API (this endpoint is for humans)',
		docs: RADIO4000_REPO_URL,
		cmsUrl: RADIO4000_CMS_URL,
		logoUrl: RADIO4000_APP_ICON_URL,
		playerScriptUrl: RADIO4000_PLAYER_SCRIPT_URL,
		api: {
			url: RADIO4000_API_URL,
			channelBackup: `${RADIO4000_API_URL}/backup?slug=${channelSlug}`,
			channelEmbedUrl: `${RADIO4000_API_URL}/embed?slug=${channelSlug}`,
			channelOEmbedUrl: `${RADIO4000_API_URL}/oembed?slug=${channelSlug}`,
			youtube: `${RADIO4000_API_URL}/youtube?id=`,
		},
		firebaseDatabase: {
			url: null,
			channelsUrl: null,
			channelUrl: null,
			tracksUrl: null,
			trackUrl: null,
		},
		supabaseDatabase: {
			url: SUPABASE_URL,
		},
		internal: {
			importFirebase: `${RADIO4000_API_URL}/import/firebase-realtime`,
		},
	})
})

export default app
