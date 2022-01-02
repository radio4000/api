import createDOMPurify from 'dompurify'
import {JSDOM} from 'jsdom'
import {RADIO4000_PLAYER_SCRIPT_URL} from 'utils/config'

export default function handler(req, res) {
	const slug = req.query.slug
	if (!slug) return res.status(404).send({
		message: 'missing `slug` parameter'
	})

	// Prevent XSS
	const DOMPurify = createDOMPurify(new JSDOM('').window)
	const safeSlug = DOMPurify.sanitize(slug)

	res.status(200).send(getIframe(safeSlug, config.playerScriptURL))
}

const html = `
	<!doctype html>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<body style="margin: 0">
	<style>
		html, body, radio4000-player {height: 100%;}
	</style>
	<radio4000-player channel-slug="##CHANNEL_SLUG##"></radio4000-player>
	<script src="##PLAYER_SCRIPT_URL##" async></script>
`

const getIframe = (slug) => {
	if (!slug || !config.playerScriptURL) {
		throw new Error('missing slug or playerScriptURL')
	}

	return html
		.replace(new RegExp('##CHANNEL_SLUG##', 'g'), slug)
		.replace('##PLAYER_SCRIPT_URL##', config.playerScriptURL)
}
