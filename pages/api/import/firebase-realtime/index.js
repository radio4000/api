import {requireSupabaseSession} from 'lib/middlewares/auth/supabase'
import {requireFirebaseSession} from 'lib/middlewares/auth/firebase'

import {migrate} from './migration'

async function handler(req, res) {
	if (req.method === 'OPTIONS') {
		res.status(200).end()
		return
	}
	if (req.method !== 'POST') {
		return res.status(400).json({
			message: 'Only POST requests allowed',
		})
	}

	const {userSupabase, userFirebase} = req

	// Shouldn't be needed because of the middleware, but lets keep for now?
	if (!userSupabase || !userFirebase) {
		return res.status(500).send({
			message: 'Missing authentication tokens required for migration',
		})
	}

	try {
		await migrate({userFirebase, userSupabase})
		console.log('Done migrating')
	} catch (error) {
		console.log('Error migrating', error)
		return res.status(500).send(error)
	}
	console.log('Sucess migrating')
	return res.status(200).send({message: 'Migration complete'})
}

// export default handler
export default requireSupabaseSession(requireFirebaseSession(handler))
