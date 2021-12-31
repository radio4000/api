// const {NODE_ENV} = process.env

// URL of this application
let apiURL = 'http://localhost:4001'

// Firebase database URL
let databaseURL = 'https://radio4000-staging.firebaseio.com/'

// CDN URL to the radio4000-player script
const playerScriptURL = 'https://cdn.jsdelivr.net/npm/radio4000-player@latest/dist/radio4000-player.min.js'

// if (NODE_ENV === 'production') {
// 	apiURL = 'https://api.radio4000.com'
// 	databaseURL = 'https://radio4000.firebaseio.com/'
// }

const config = {
	apiURL,
	databaseURL,
	playerScriptURL,
}

export default config
