import { Hono } from 'hono'
import type { Env } from '../config'

const app = new Hono<{ Bindings: Env }>()

app.get('/', (c) => {
	const slug = c.req.query('slug')

	// Prevent XSS - simple regex sanitization
	const safeSlug = slug ? slug.replace(/[^a-zA-Z0-9-]/g, '') : ''

	if (!safeSlug) {
		return c.json(
			{
				message: 'Missing parameter `?slug=`',
			},
			404
		)
	}

	const baseUrl = new URL(c.req.url).origin
	const html = getIframe(safeSlug, baseUrl)

	return c.html(html)
})

const getIframe = (slug: string, baseUrl: string) => {
	return `<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<title>@${slug} | Radio4000</title>
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

		<r4-app
			href="${baseUrl}/api/v2/embed/"
			single-channel="true"
			channel=${slug}
			cdn
		></r4-app>

		<script async type="module" src="https://cdn.jsdelivr.net/npm/@radio4000/components@latest/dist/r4.js"><\/script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@radio4000/components@latest/dist/r4.css" />

	</body>
</html>`
}

export default app
