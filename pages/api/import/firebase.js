import {requireTestSession} from 'middlewares/auth/test'
import {requireSupabaseSession} from 'middlewares/auth/supabase'
import {requireFirebaseSession} from 'middlewares/auth/firebase'

import {migrate} from './migration'

async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(400).json({
			message: 'Only POST requests allowed'
		})
	}

	const {userTest, user, userFirebase, channelFirebase} = req
	console.log({
		userTest,
		userSupabase,
		userFirebase,
		channelFirebase,
	})

	if (!userTest || !userSupabase || !userFirebase) {
		return res.status(500).send({
			message: 'Could not migrate, missing authentication tokens',
		})
	}

	try {
		// const firebaseChannelId = ???
		const supabaseUserId = userSupabase.id
		migrate(firebaseChannelId, supabaseUserId)
	} catch (err) {
		console.log(err)
		res.status(500).send({message: 'Could not migrate'})
	}
}

/* export default requireTestSession(handler) */
export default requireSupabaseSession(handler)
/* export default requireFirebaseSession(handler) */
