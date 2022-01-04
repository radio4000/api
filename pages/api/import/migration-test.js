import {getUser, getUserExport} from 'lib/providers/firebase-database'

import {
    getUserChannel as getUserChannelSupabase
} from 'lib/providers/supabase-admin'

async function migrateTest({
	userFirebase,
	userSupabase,
}) {
	console.log(userFirebase)
  const userExport = await getUser(userFirebase.uid)
	if (userExport) {
		return Promise.reject(false)
	}
	return Promise.resolve({
		userExport
	})
}

export {
    migrateTest as migrate
}
