import {getChannelBackup} from 'lib/providers/firebase-admin'

export default async function handler(req, res) {
	const slug = req.query.slug
	if (!slug) {
		return res.status(404).json({
			message: 'Missing parameter `?slug=` for a channel slug',
		})
	}

	let backup
	try {
		backup = await getChannelBackup(slug)
	} catch(error) {
		console.error(error)
		res.status(404).json({
			message: `Could find data to backup for channel @${slug}`
		})
	}

	if (!backup) {
		res.status(404).json({
			message: `Could not create backup for channel @${slug}`
		})
	}
	res.status(200).send(backup)
}
