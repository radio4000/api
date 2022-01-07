import config from 'lib/config'

const {
	RADIO4000_REPO_URL,
	RADIO4000_CMS_URL,
	RADIO4000_API_URL,
	RADIO4000_PLAYER_SCRIPT_URL,
	RADIO4000_APP_ICON_URL,

	FIREBASE_DATABASE_URL,
	SUPABASE_URL,
	CLOUDINARY_URL
} = config

export default function handler(req, res) {
	const {
		channelSlug = '{channel-slug}',
		channelId = '{channel-id}',
		trackId = '{track-id}',
	} = req.query

	res.status(200).json({
		message: 'Welcome to the Radio4000 API (this endpoint is for humans)',
		docs: RADIO4000_REPO_URL,
		cmsUrl: RADIO4000_CMS_URL,
		logoUrl: RADIO4000_APP_ICON_URL,
		playerScriptUrl: RADIO4000_PLAYER_SCRIPT_URL,
		api: {
			url: RADIO4000_API_URL,
			channelBackup: `${RADIO4000_API_URL}/api/backup?slug=${channelSlug}`,
			channelEmbedUrl: `${RADIO4000_API_URL}/api/embed?slug=${channelSlug}`,
			channelOEmbedUrl: `${RADIO4000_API_URL}/api/oembed?slug=${channelSlug}`,
			youtube: `${RADIO4000_API_URL}/api/youtube?id=`,
		},
		firebaseDatabase: {
			url: FIREBASE_DATABASE_URL,
			channelsUrl: `${FIREBASE_DATABASE_URL}/channels.json`,
			channelUrl: `${FIREBASE_DATABASE_URL}/channels/${channelId}.json`,
			tracksUrl: `${FIREBASE_DATABASE_URL}/tracks.json`,
			trackUrl: `${FIREBASE_DATABASE_URL}/tracks/${trackId}.json`,
		},
		supabaseDatabase: {
			url: SUPABASE_URL,
		},
		internal: {
			importFirebase: `${RADIO4000_API_URL}/api/import/firebase-realtime`,
		},
	})
}
