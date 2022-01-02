/*
this is what I have

SUPABASE_URL=https://cjvcbecpbnurbynjisqa.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTUwNzQ3MCwiZXhwIjoxOTU1MDgzNDcwfQ.zUJ84oAzIBM0j7XH3Se0Ew_szs5-H3BMryG3BYeQlH4

PGHOST=db.cjvcbecpbnurbynjisqa.supabase.co
PGUSER=postgres
PGDATABASE=postgres
PGPASSWORD=Go8luijahph0EizeePu0Eitho1Ai5Toot
PGPORT=5432

FIREBASE_SERVICE_ACCOUNT_PROJECT_ID=firebase-radio4000
FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL=firebase-adminsdk-4g76o@firebase-radio4000.iam.gserviceaccount.com
FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClb0nUyFCDhFSZ\nGOlpaSPBEz+Ntk106vQRdEZv4PNyQZyZDDG+sVv7yoQtkHc6A7PniDbTVhxIJjy7\n6abXH79PuERAvku0mjEEw165xUx+oiPdlNXtAUUHuh0uXo11sQQigg6ajm6wHzVB\nLEDXwXh/r6rglLU5Qlsj+scSozsGC7s+iNEnHkvqOH7ubPbC24j8sFH3ntONMu2N\nEgS7zzuY3zuhfWpT1v3sE21KJ5tHYwJoBTC2/8G1rd9jv+AEWJPTMqBjZN7Nx5mn\nJiwLjZGAlmRJeJ8Bx/R2U7ENE8FZv3yC3MybDgWbXg6q8UtvxIkJpfiYqDKgg25M\nHATkUqL3AgMBAAECggEAFJ73m/9QEeSnyuGRDqOdYk6s6FQl+YHj5F0S/pUSo1ZM\nV8NuW++toIgQy8ErK18UyLJw6wzbv56MiXvJYR1C8oPsdgmCVEO4Anj70LooG8zI\nHbGUrNMwsJLhWktM5LOo6Ug+28MPRwLM14/VkU87XucdrJq8sCN2StjSgZ85Fzqh\nvcsQcaQnPm7t5Q3TpUsJnBMm5NVpkuCMpoDmYbXN2/Bddvp8AAB5qdVIUlTKdBFh\nNjyHpQdX2Ob8NWQckF7qRHXcx5U50CTfNnM2Z7Pqgrs8Gu+OZFqIlg4087OwOcPF\nQSWjpF8V33Z3EINPcMxC+SS/esJRshcv2Jp3cByj0QKBgQDZYgC8xJ9YJec1gCNT\nfbOXGE+rW+76xjI37LPVsAprcbeQtLTO/P9er4vSuRTTVthMAn50yUsDdb/yuLjE\nt+GiVZQoKm7O7USEssVoD0DeFEtqWDC2+5rKcLXY1MRHZRhhRUslyHbQbCeFv4Ga\noIyZi4ilpu4yJne/LclxIUcNGQKBgQDC0tKoFwPsQjpmWzYnq1vwCiW0fcfmzsVO\ntflPdi/QgXbIj1XZB0qklehGz/cVwZpPXovIgkeg0M9l1xw610bh113v625LICNV\nSAl+avmuCz9C1E3JoQ0TcKxyqAqpEuTfe0bav9Pm2ob2gmEuwOACIEQZ1J6xNcuR\nir4ApK0ijwKBgAUq9UWHjxozXHnDIBPeCyTuaQZz2wyPJaZ6tBPCaZ0ASRLhmOLK\n1O9VUQejasFTcTTtYkA4gNYGOJf2mD3k+TI4wprp11SIA3b8IQFGS458AQb4LcBL\n3vQtFcWf2UKxPpEhapXtXBW8XHwrf1NDudP0ozz86PC8RWCAICfWWLARAoGAe+f7\nhF5G527jl4+xLJ+mdE7v1hAdICUnhbzkl+4R0OlV8459ye8CQRT6SncfrV2ZV5tJ\nCbgZ+CR1k06xLJcYBLCllN5GIk+JSUbsitNcgp2ymT1PT8o298M0WiOXzBoxKBVO\nZfeUvIEFTyhyyHpwvclppof8ebY+Bw2Xc+9IEe8CgYArI21a9QVgc+l2GQGTrVt6\nS+QaR0QFChZym7+qBDSkUghLKREH3dqPmR+6okxhqyjF/fCpi1i0zKzrHpt6Sq43\n9kWYzpNHNmq6vMWxoZ4PkK5ve9s5GVmJeYwRXQeZ9iWQWMDp5AkPge9PtirJbMhG\nhyUlCRO54HO3tlJM/Jy7WQ==\n-----END PRIVATE KEY-----\n"




development (local)
preview (staging, only for api, not for cms))
production


yepppp


we can (should?) add them via vercel ui as well?
https://vercel.com/internet4000/radio4000-api/settings/environment-variables

yep, we don't commit .env, but add all env thorugh vercel for production & staging
i seeee
do we commit .env.local?  guess not this one
.env.development? maybe yes? no
*/

// default case, process.env.VERCEL_ENV === 'development'
const config = {
	// URL for the fulldocs
	repoURL: 'https://github.com/radio4000/api-vercel',
	// URL of this application
	apiURL: 'http://localhost:3000',
	// Firebase database URL
	databaseURL: 'https://radio4000-staging.firebaseio.com/',
	// CDN URL to the radio4000-player script
	playerScriptURL: 'https://cdn.jsdelivr.net/npm/radio4000-player@latest/dist/radio4000-player.min.js',

	/* firebase */
	firebase: {
		databaseURL: process.env.FIREBASE_DATABASE_URL,
		serviceAccount: {
			projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
			clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
			// from the firebase provided service account file , stored in env as a string
			privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
		},
	}
}

if (process.env.VERCEL_ENV === 'production') {
	config.apiURL = 'https://api.radio4000.com'
	config.databaseURL = 'https://radio4000.firebaseio.com/'
}

if (process.env.VERCEL_ENV === 'preview') {
	if (process.env.NEXT_PUBLIC_VERCEL_URL) config.apiURL = process.env.NEXT_PUBLIC_VERCEL_URL
}


/*
	make config checks
*/
// list required environment variables
const newConfig = [
	'FIREBASE_DATABASE_URL',
	'FIREBASE_SERVICE_ACCOUNT_PROJECT_ID',
	'FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL',
	'FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY',

	'SUPABASE_URL',
	'SUPABASE_ANON_KEY',

	'PGHOST',
	'PGUSER',
	'PGDATABASE',
	'PGPASSWORD',
	'PGPORT',
].map(envVar => {
	return process.env[envVar]
})

console.log(newConfig)

export default config
