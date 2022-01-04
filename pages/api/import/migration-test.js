import {getUser, getUserExport} from 'lib/providers/firebase-database'

import {
    getUserChannel as getUserChannelSupabase
} from 'lib/providers/supabase-admin'

async function migrateTest({
	userFirebase,
	userSupabase,
}) {
    const user = await getUser(userFirebase.uid)
    console.log('user', user)
	return Promise.resolve(true)
}

export {
    migrateTest as migrate
}
