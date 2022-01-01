import config from '../../utils/config'

export default function handler(req, res) {
	const welcome = {
		message: 'Welcome to the Radio4000 API',
		api: {
			docs: 'https://github.com/internet4000/radio4000-api-vercel',
			channelBackup: `${config.apiURL}/backup?slug={slug}`,
			channelEmbedUrl: `${config.apiURL}/embed?slug={slug}`,
			channelOEmbedUrl: `${config.apiURL}/oembed?slug={slug}`,
		},
		database: {
			docs: 'https://github.com/internet4000/radio4000-firebase-rules',
			url: config.databaseURL,
			channelsUrl: `${config.databaseURL}channels.json`,
			channelUrl: `${config.databaseURL}channels/{id}.json`,
			tracksUrl: `${config.databaseURL}tracks.json`,
			trackUrl: `${config.databaseURL}tracks/{id}.json`,
		},
	}
	res.status(200).json(welcome)
}
