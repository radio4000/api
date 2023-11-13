import createDOMPurify from 'dompurify'
import {JSDOM} from 'jsdom'

export default function handler(req, res) {
	const slug = req.query.slug

	// Prevent XSS
	const DOMPurify = createDOMPurify(new JSDOM('').window)
	const safeSlug = DOMPurify.sanitize(slug)

	if (!safeSlug)
		return res.status(404).json({
			message: 'Missing parameter `?slug=`',
		})

	res.status(200).send(getIframe(safeSlug))
}

const getIframe = (slug) => {
	return `
<!DOCTYPE html>
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
			href="http://localhost:3001/api/v2/embed/"
			single-channel="true"
			channel=${slug}
			cdn
		></r4-app>

		<script async type="module" src="https://cdn.jsdelivr.net/npm/@radio4000/components@latest/dist/r4.js"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@radio4000/components@latest/dist/r4.css" />

	</body>
</html>
`
}
