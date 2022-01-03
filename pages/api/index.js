import config from 'utils/config'

const {
	RADIO4000_API_URL,
	RADIO4000_REPO_URL,
	FIREBASE_DATABASE_URL
} = config

export default function handler(req, res) {
	res.status(200).json({
		message: 'Welcome to the Radio4000 API',
		api: {
			docs: `${RADIO4000_REPO_URL}`,
			channelBackup: `${RADIO4000_API_URL}/backup?slug={slug}`,
			channelEmbedUrl: `${RADIO4000_API_URL}/embed?slug={slug}`,
			channelOEmbedUrl: `${RADIO4000_API_URL}/oembed?slug={slug}`,
		},
		firebaseDatabase: {
			docs: `${RADIO4000_REPO_URL}`,
			url: `${FIREBASE_DATABASE_URL}`,
			channelsUrl: `${FIREBASE_DATABASE_URL}/channels.json`,
			channelUrl: `${FIREBASE_DATABASE_URL}/channels/{id}.json`,
			tracksUrl: `${FIREBASE_DATABASE_URL}/tracks.json`,
			trackUrl: `${FIREBASE_DATABASE_URL}/tracks/{id}.json`,
		},
		internal: {
			docs: `${RADIO4000_REPO_URL}`,
			importFirebase: `${RADIO4000_API_URL}/import/firebase`,
		}
	})
}
