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
	return `<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width" />
		<title>@${slug} | Radio4000</title>
		<meta name="description" content="${slug}@r4-player">
		<style>
			html,
			body,
			r4-player {
				min-height: 100%;
				min-width: 100%;
				display: flex;
				margin: 0;
			}
			r4-player radio4000-player {
				flex-grow: 1;
				height: 100%;
			}
		</style>
	</head>
	<body>
		<r4-player></r4-player>

		<script type="module">
			import "https://fastly.jsdelivr.net/npm/@radio4000/components@0.2.17/dist/r4.js";
			import { sdk } from "https://fastly.jsdelivr.net/npm/@radio4000/sdk/+esm";

			function createImage(id) {
				const baseUrl = "https://res.cloudinary.com/radio4000/image/upload";
				const size = 250;
				const dimensions = \`w_\${size},h_\${size}\`;
				const crop = "c_thumb,q_60";
				return \`\${baseUrl}/\${dimensions},\${crop},fl_awebp/\${id}.webp\`;
			}

			(async ({ slug = "" }) => {
				if (!slug) return;
				const { data: channel } = await sdk.channels.readChannel(slug);
				const { data: tracks } = await sdk.channels.readChannelTracks(slug);
				const $app = document.querySelector("r4-player");
				$app.setAttribute("href", "${baseUrl}");
				$app.setAttribute("name", channel.name);
				$app.setAttribute("image", createImage(channel.image));
				$app.tracks = tracks
					.map((track) => {
						return {
							...track,
							body: track.description,
						};
					})
					.reverse();
			})({ slug: "${slug}" });
		<\/script>
	</body>
</html>`
}

export default app
