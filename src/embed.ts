import { Hono } from 'hono'
import type { Env } from './config'

const RADIO4000_PLAYER_SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/radio4000-player'

const app = new Hono<{ Bindings: Env }>()

/**
 * Sanitize slug by removing any characters that aren't alphanumeric or hyphens
 */
const sanitizeSlug = (slug: string): string => {
	return slug.replace(/[^a-zA-Z0-9-]/g, '')
}

/**
 * Generate HTML iframe for the Radio4000 player
 */
const getIframe = (slug: string, playerScriptUrl: string): string => {
	return `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<title>@${slug} | Radio4000 player</title>
		<meta name="description" content="${slug}@r4-player">
		<style>
			html, body, radio4000-player {
				height: 100% !important;
			}
			body {
				margin: 0;
			}
		</style>
	</head>
	<body>
		<radio4000-player channel-slug="${slug}"></radio4000-player>
		<script async src="${playerScriptUrl}"><\/script>
	</body>
</html>`
}

app.get('/', (c) => {
	const slug = c.req.query('slug')

	// Sanitize slug to prevent XSS
	const safeSlug = slug ? sanitizeSlug(slug) : ''

	if (!safeSlug) {
		return c.json({
			message: 'Missing parameter `?slug=`'
		}, 404)
	}

	return c.html(getIframe(safeSlug, RADIO4000_PLAYER_SCRIPT_URL))
})

export default app
