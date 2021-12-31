import noEndpoint from '../../utils/no-endpoint'
import {createBackup} from 'radio4000-sdk'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default function handler(req, res) {
	const slug = req.query.slug
	if (!slug) return noEndpoint(res)

	return createBackup(slug)
		.then((backup) => res.status(200).send(backup))
		.catch((error) => {
			res.status(500).send({
				message: `Could not fetch channel '${slug}'`,
				code: 500,
				internalError: error,
			})
		})
}

