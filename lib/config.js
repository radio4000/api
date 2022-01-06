/*
	DOCS: https://vercel.com/internet4000/radio4000-api/settings/environment-variables

	Secret ENV VARS:
	.env{.*}.local

	Public ENV VARS:
	.env
	.env.development
	.env.production
*/

const defaultRadio4000ApiUrl = 'https://api.radio4000.com'

/* a list of required env vars to run to app */
const requiredEnvVars = {
	'RADIO4000_REPO_URL': null,
	'RADIO4000_CMS_URL': null,
	'RADIO4000_API_URL': null,
	'RADIO4000_PLAYER_SCRIPT_URL': null,
	'RADIO4000_APP_ICON_URL': null,

	'CLOUDINARY_URL': null,

	'FIREBASE_DATABASE_URL': null,
	'FIREBASE_SERVICE_ACCOUNT_PROJECT_ID': null,
	'FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL': null,
	'FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY': null,

	'SUPABASE_URL': null,
	'SUPABASE_ANON_KEY': null,

	'YOUTUBE_API_KEY': null,

	'PGHOST': null,
	'PGUSER': null,
	'PGDATABASE': null,
	'PGPASSWORD': null,
	'PGPORT': null,
}

/* assign env values to a config object */
let config = {}
Object.keys(requiredEnvVars).forEach(envVar => {
	const envVarValue = process.env[envVar]
	config[envVar] = envVarValue
})

/* serialize firebase keys, exported to en env var, from a file to a string */
config.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY = config.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')

/* List missing required environment variables */
Object.keys(config).forEach(configKey => {
	const configValue = config[configKey]

	if (configKey.startsWith('RADIO4000_') && !configValue) {
		console.error({
			message: 'Missing required Radio4000@api env variable',
			variable: configKey,
			value: configValue
		})
	}
	if (configKey.startsWith('CLOUDINARY_') && !configValue) {
		console.error({
			message: 'Missing required Radio4000@cloudinary images env variable',
			variable: configKey,
			value: configValue
		})
	}
	if (configKey.startsWith('SUPABASE_') && !configValue) {
		console.error({
			message: 'Missing required Radio4000@supabase env variable',
			variable: configKey,
			value: configValue
		})
	}
	if (configKey.startsWith('PG') && !configValue) {
		console.error({
			message: 'Missing required Radio4000@supabase/postgresql env variable',
			variable: configKey,
			value: configValue
		})
	}
	if (configKey.startsWith('FIREBASE_') && !configValue) {
		console.warn({
			message: 'Missing required Firebase env variable; it will not be possible to use Firebase legacy endpoints',
			variable: configKey,
			value: configValue
		})
	}
	if (configKey.startsWith('YOUTUBE_') && !configValue) {
		console.warn({
			message: 'Missing required YouTube env variable; it will not be possible to use the /youtube endpoint',
			variable: configKey,
			value: configValue
		})
	}
})

/* vercel environment specifics */
if (process.env.VERCEL_ENV === 'preview') {
	const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL
	if (vercelUrl) config.RADIO4000_API_URL = `https://${vercelUrl}`
}

export default config
