import {requireSupabaseSession} from 'lib/middlewares/auth/supabase'
import {requireFirebaseSession} from 'lib/middlewares/auth/firebase'

import {migrate} from './migration'

// By default Vercel cuts timeouts at 10 seconds. With our pro account we can do 300.
export const config = {
	maxDuration: 300
}

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
		console.log('Started migration')
		const result = await migrate({userFirebase, userSupabase})
		console.log('Success migrating')
		return res.status(200).send({message: 'Migration complete', result})
	} catch (error) {
		console.log('IT WENT WRONG')
		console.log(error.message)
		return res.status(500).send({message: `Failed to migrate: ${error.message}`})
	}
}

// export default handler
export default requireSupabaseSession(requireFirebaseSession(handler))
