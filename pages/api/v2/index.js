import config from 'lib/config'

const {RADIO4000_API_URL} = config

export default function handler(req, res) {
	const { channelSlug = '{channel-slug}', } = req.query
	res.status(200).json({
		message: 'Welcome to the Radio4000 V2 API (this endpoint is for humans)',
		v2: {
			channelBackup: `${RADIO4000_API_URL}/v2/backup?slug=${channelSlug}`,
			channelEmbedUrl: `${RADIO4000_API_URL}/v2/embed?slug=${channelSlug}`,
		},
	})
}

