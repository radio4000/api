import firebaseClient from '/utils/firebase-admin'
import {requireSupabaseSession} from 'middlewares/auth/supabase'
import {requireFirebaseSession} from 'middlewares/auth/firebase'

import {migrate} from './migration'

async function handler(req, res) {
	if (req.method === 'OPTIONS') {
		res.status(200)//.end()
		return
	}
	if (req.method !== 'POST') {
		return res.status(400).json({
			message: 'Only POST requests allowed',
		})
	}

	const {userSupabase, userFirebase, channelFirebase} = req
	// console.log({userSupabase, userFirebase, channelFirebase})

	if (!userSupabase || !userFirebase) {
		return res.status(500).send({
			message: 'Could not migrate, missing authentication tokens',
		})
	}

	let firebaseChannelId = false // @todo
	if (!firebaseChannelId) {
		return res.status(500).send({
			message: 'Could not migrate, missing firebase channel id'
		})
	}

	try {
		const supabaseUserId = userSupabase.id
		migrate(firebaseChannelId, supabaseUserId)
	} catch (err) {
		console.log(err)
		res.status(500).send({message: 'Could not migrate'})
	}
}

// export default handler
export default requireSupabaseSession(requireFirebaseSession(handler))
