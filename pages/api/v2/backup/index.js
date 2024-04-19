import postgresClient from 'lib/providers/postgres-admin'

async function exportChannel(slug) {
	const res = await postgresClient.query('select * from channels where slug = $1', [slug])
	return res.rows[0]
}

async function exportTracks(slug) {
	const res = await postgresClient.query('select * from channel_tracks where slug = $1', [slug])
	return res.rows
}

export default async function handler(req, res) {
	const {slug} = req.query
	if (!slug) {
		return res.status(404).json({
			message: 'Missing parameter `?slug=` for a channel slug',
		})
	}
	try {
		const channel = await exportChannel(slug)
		const tracks = await exportTracks(slug)
		return res.status(200).json({channel, tracks})
	} catch (error) {
		console.error(error)
		return res.status(500).json({error: `Failed to back up @${slug}`,})
	}
}
