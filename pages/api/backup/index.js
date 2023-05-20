import {getChannelBackup, getUserExport} from 'lib/providers/firebase-admin'

export default async function handler(req, res) {
	if (!req.query.slug && !req.query.uid) {
		return res.status(404).json({
			message: 'Missing parameter `?slug=` for a channel slug, OR `?uid=` for a user id',
		})
	}
	try {
		let backup
		if (req.query.uid) {
			backup = await getUserExport(req.query.uid)
		} else if (req.query.slug) {
			backup = await getChannelBackup(req.query.slug)
		}
		return res.status(200).json(backup)
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: `Failed to back up @${req.query.slug || req.query.uid}`,
		})
	}
}
