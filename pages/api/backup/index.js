import {createBackup} from 'radio4000-sdk'

export default function handler(req, res) {
	const slug = req.query.slug
	if (!slug)
		return res.status(404).json({
			message: 'Missing parameter `?slug=` for a channel slug',
		})

	return createBackup(slug)
		.then((backup) => res.status(200).send(backup))
		.catch((error) => {
			res.status(404).json({
				message: `Could not fetch channel @${slug}`
			})
		})
}
