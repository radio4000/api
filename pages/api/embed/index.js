import createDOMPurify from 'dompurify'
import {JSDOM} from 'jsdom'
import config from 'lib/config'

const {RADIO4000_PLAYER_SCRIPT_URL} = config

export default function handler(req, res) {
	const slug = req.query.slug

	// Prevent XSS
	const DOMPurify = createDOMPurify(new JSDOM('').window)
	const safeSlug = DOMPurify.sanitize(slug)

	if (!safeSlug) return res.status(404).json({
		message: 'Missing parameter `?slug=`'
	})

	res.status(200).send(getIframe(safeSlug, RADIO4000_PLAYER_SCRIPT_URL))
}

const getIframe = (slug, playerScriptUrl) => {
	return `
<!DOCTYPE html>
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
		<script async src="${playerScriptUrl}"></script>
	</body>
</html>
`
}
