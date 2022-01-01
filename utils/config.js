const production = process.env.VERCEL_ENV === 'production'

const config = {
	// URL of this application
	apiURL: process.env.VERCEL_URL || 'http://localhost:3000',
	// Firebase database URL
	databaseURL: production ? 'https://radio4000.firebaseio.com/' : 'https://radio4000-staging.firebaseio.com/',
	// CDN URL to the radio4000-player script
	playerScriptURL: 'https://cdn.jsdelivr.net/npm/radio4000-player@latest/dist/radio4000-player.min.js',
}

export default config
