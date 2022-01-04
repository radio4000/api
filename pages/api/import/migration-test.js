import {getUser, getUserExport} from 'lib/providers/firebase-admin'

import {
    getUserChannel as getUserChannelSupabase
} from 'lib/providers/supabase-admin'

async function migrateTest({
	userFirebase,
	userSupabase,
}) {
	const user = await getUser(userFirebase.uid)
  const userExport = await getUserExport(userFirebase.uid)
	console.log('User export', userExport, user, userFirebase)
	if (!userExport) {
		return Promise.reject(false)
	}
	return Promise.resolve({
		userExport
	})
}

export {
    migrateTest as migrate
}
