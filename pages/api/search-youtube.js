import {Client} from 'youtubei'

export default async function handler(req, res) {
	const query = req.query.query

	if (!query) return res.status(500).json({error: 'missing ?query'})

	const youtube = new Client()
	const results = await youtube.search(query, {type: 'video'})
	const videos = results.items.map(x => {
		return {
			id: x.id,
			title: x.title,
			viewCount: x.viewCount
		}
	})
	res.status(200).json({query, videos})
}

