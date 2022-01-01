import createDOMPurify from 'dompurify'
import {JSDOM} from 'jsdom'
import config from '../../utils/config'
import noEndpoint from '../../utils/no-endpoint'
import getIframe from '../../utils/get-iframe'

export default function handler(req, res) {
	const slug = req.query.slug
	if (!slug) return noEndpoint(res)

	// Prevent XSS
	const DOMPurify = createDOMPurify(new JSDOM('').window)
	const safeSlug = DOMPurify.sanitize(slug)

	res.status(200).send(getIframe(safeSlug, config.playerScriptURL))
}
