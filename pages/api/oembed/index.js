import createDOMPurify from 'dompurify'
import {JSDOM} from 'jsdom'
import {findChannelBySlug} from 'utils/firebase-rest'
import config from 'utils/config'

const {
	RADIO4000_API_URL,
	RADIO4000_CMS_URL,
	RADIO4000_APP_ICON_URL,
	CLOUDINARY_URL,
} = config

export default function handler(req, res) {
	const slug = req.query.slug

	if (!slug) return res.status(404).json({
		message: `Missing parameter ?slug=`
	})

	return findChannelBySlug(slug)
		.then((channel) => {
			if (!channel) {
				return res.status(404).json({
					message: `Requested channel @${slug} does not exist`
				})
			}
			const embedHtml = getOEmbed(channel)
			res.status(200).send(embedHtml)
		})
		.catch((err) => {
			console.log(err)
			res.status(500).send({
				message: `Could not fetch channel @${slug}`,
				code: 500,
				internalError: err,
			})
		})
}

const getOEmbed = ({slug, title, body = '', image}) => {
	let thumbnailUrl
	if (CLOUDINARY_URL && image) {
		thumbnailUrl = `${CLOUDINARY_URL}/image/upload/w_500,h_500,c_thumb,q_60,fl_lossy/${image}`
	} else {
		thumbnailUrl = `${RADIO4000_APP_ICON_URL}`
	}

	// Prevent XSS
	const DOMPurify = createDOMPurify(new JSDOM('').window)
	const safeSlug = DOMPurify.sanitize(slug)

	return {
		version: '1.0',
		type: 'rich',
		provider_name: 'Radio4000',
		provider_url: RADIO4000_CMS_URL,
		author_name: title,
		author_url: `${RADIO4000_CMS_URL}/${safeSlug}`,
		title: title,
		description: body,
		thumbnail_url: thumbnailUrl,
		html: `<iframe width="320" height="500" src="${RADIO4000_API_URL}/embed?slug=${safeSlug}" frameborder="0"></iframe>`,
		width: 320,
		height: 500,
	}
}
