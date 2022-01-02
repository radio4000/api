/*
	DOCS

	Public:
	.env
	.env.development
	.env.production

	Secret:
	.env.local
	vercel.com https://vercel.com/internet4000/radio4000-api/settings/environment-variables
*/

/*
	make config checks,
	list required environment variables
*/
const requiredEnvVars = {
	'RADIO4000_REPO_URL': null,
	'RADIO4000_CMS_URL': null,
	'RADIO4000_API_URL': null,
	'RADIO4000_PLAYER_SCRIPT_URL': null,

	'CLOUDINARY_URL': null,

	'FIREBASE_DATABASE_URL': null,
	'FIREBASE_SERVICE_ACCOUNT_PROJECT_ID': null,
	'FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL': null,
	'FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY': null,

	'SUPABASE_URL': null,
	'SUPABASE_ANON_KEY': null,

	'PGHOST': null,
	'PGUSER': null,
	'PGDATABASE': null,
	'PGPASSWORD': null,
	'PGPORT': null,
}

let config = {}
Object.keys(requiredEnvVars).forEach(envVar => {
	const envVarValue = process.env[envVar]
	config[envVar] = envVarValue
	if (envVar.startsWith('RADIO4000_') && !envVarValue) {
		console.error({
			message: 'Missing required Radio4000@api env variable',
			variable: envVar,
			value: envVarValue
		})
	}
	if (envVar.startsWith('CLOUDINARY_') && !envVarValue) {
		console.error({
			message: 'Missing required Radio4000@cloudinary images env variable',
			variable: envVar,
			value: envVarValue
		})
	}
	if (envVar.startsWith('SUPABASE_') && !envVarValue) {
		console.error({
			message: 'Missing required Radio4000@supabase env variable',
			variable: envVar,
			value: envVarValue
		})
	}
	if (envVar.startsWith('PG') && !envVarValue) {
		console.error({
			message: 'Missing required Radio4000@supabase/postgresql env variable',
			variable: envVar,
			value: envVarValue
		})
	}
	if (envVar.startsWith('FIREBASE_') && !envVarValue) {
		console.warn({
			message: 'Missing required Firebase env variable; it will not be possible to use Firebase legacy endpoints',
			variable: envVar,
			value: envVarValue
		})
	}
})

// serialize firebase keys, exported to en env var, from a file to a string
config.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n')

if (process.env.VERCEL_ENV === 'preview') {
	const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL
	if (vercelUrl) config.apiURL = vercelUrl
}

if (process.env.VERCEL_ENV === 'production') {
	config.apiURL = process.env.RADIO4000_API_URL || 'https://api.radio4000.com'
}

export default config
