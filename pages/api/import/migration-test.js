import {getUser, getUserExport} from 'lib/providers/firebase-admin'

import {
    getUserChannel as getUserChannelSupabase
} from 'lib/providers/supabase-admin'

async function migrateTest({
	userFirebase,
	userSupabase,
}) {
    const user = await getUser(userFirebase)
    console.log('user', user)
	return Promise.resolve(true)
}

export {
    migrateTest as migrate
}
