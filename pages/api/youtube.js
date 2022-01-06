import fetch from 'node-fetch'
import config from 'lib/config'
// import {asSeconds} from 'pomeranian-durations'

const {YOUTUBE_API_KEY} = config

export default async function handler(req, res) {
	const ytid = req.query.ytid

	try {
		// Make sure we have what we need.
		if (!YOUTUBE_API_KEY) throw new Error('A YOUTUBE_KEY in your .env file is required')
		if (!ytid) throw new Error('A ytid query parameter is required')

		// Fetch from the YouTube Data API. Key is from Google Cloud console credentials.
		const {items} = await fetch(
			`https://www.googleapis.com/youtube/v3/videos?part=status,contentDetails,snippet&id=${ytid}&key=${YOUTUBE_API_KEY}`
		).then((res) => res.json())

		// It does not throw with no results, so we check here.
		if (items.length === 0) return res.status(404).json({message: 'YouToube video not found'})

		// Serialize and return.
		res.status(200).json(serialize(items[0]))
	} catch (err) {
		res.status(500).json({message: err.message})
	}
}

// Picks the most useful things out of the default YouTube response.
function serialize(item) {
	return {
		id: item.id,
		url: `https://www.youtube.com/watch?v=${item.id}`,

		// Requires ?part=snippet
		title: item.snippet.title,
		description: item.snippet.description,
		thumbnails: item.snippet.thumbnails,
		tags: item.snippet.tags,

		// Requires ?part=contentDetails
		// See https://github.com/date-fns/date-fns/pull/348
		// Once date-fns supports durations let's switch to that.
		// duration: asSeconds(item.contentDetails.duration),
		duration: item.contentDetails.duration,

		// Requires ?part=status
		status: item.status,
	}
}
