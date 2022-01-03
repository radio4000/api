import config from 'utils/config'

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
	res.status(200).json({
		message: 'Welcome to the Radio4000 API (this endpoint is for humans)',
		docs: `${RADIO4000_REPO_URL}`,
		cmsUrl: `${RADIO4000_CMS_URL}`,
		logoUrl: `${RADIO4000_APP_ICON_URL}`,
		playerScriptUrl: `${RADIO4000_PLAYER_SCRIPT_URL}`,
		api: {
			channelBackup: `${RADIO4000_API_URL}/backup?slug={slug}`,
			channelEmbedUrl: `${RADIO4000_API_URL}/embed?slug={slug}`,
			channelOEmbedUrl: `${RADIO4000_API_URL}/oembed?slug={slug}`,
		},
		firebaseDatabase: {
			url: `${FIREBASE_DATABASE_URL}`,
			channelsUrl: `${FIREBASE_DATABASE_URL}/channels.json`,
			channelUrl: `${FIREBASE_DATABASE_URL}/channels/{id}.json`,
			tracksUrl: `${FIREBASE_DATABASE_URL}/tracks.json`,
			trackUrl: `${FIREBASE_DATABASE_URL}/tracks/{id}.json`,
		},
		supabaseDatabase: {
			url: `${SUPABASE_URL}`,
		},
		internal: {
			importFirebase: `${RADIO4000_API_URL}/import/firebase`,
		},
	})
}
