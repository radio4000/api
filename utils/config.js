// default case, process.env.VERCEL_ENV === 'development'
const config = {
	// URL of this application
	apiURL: 'http://localhost:3000',
	// Firebase database URL
	databaseURL: 'https://radio4000-staging.firebaseio.com/',
	// CDN URL to the radio4000-player script
	playerScriptURL: 'https://cdn.jsdelivr.net/npm/radio4000-player@latest/dist/radio4000-player.min.js',
}

if (process.env.VERCEL_ENV === 'production') {
	config.apiURL = 'https://api.radio4000.com'
	config.databaseURL = 'https://radio4000.firebaseio.com/'
}

if (process.env.VERCEL_ENV === 'preview') {
	if (process.env.NEXT_PUBLIC_VERCEL_URL) config.apiURL = process.env.NEXT_PUBLIC_VERCEL_URL
}


export default config
