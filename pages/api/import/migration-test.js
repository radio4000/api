import {getUserExport} from 'lib/providers/firebase-admin'
// import {getUserChannel as getUserChannelSupabase} from 'lib/providers/supabase-admin'

async function migrateTest({userFirebase, userSupabase}) {
	console.log('test migration')
	const userExport = await getUserExport(userFirebase.uid)
	console.log('User export', userExport)
	if (!userExport) return Promise.reject(false)
	return Promise.resolve(true)
}

export {migrateTest as migrate}
