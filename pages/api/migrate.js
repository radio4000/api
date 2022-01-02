import firebaseAdmin from '../../utils/firebase-admin'
import {getAuth} from 'firebase-admin/auth'
import supabase from '../../utils/supabase'

/*
	Accepts a body with tokenFirebase & tokenSupabase,
	and verifies both. If both are valid, we call the migration.

	To test the endpoint, use this:
curl -X POST http://localhost:3000/migrate -d '{"tokenFirebase":"value1", "tokenSupabase":"value2"}' -H "Content-Type: application/json" -i
*/
export default async function migrate(req, res) {
	// Only allow POST requests.
	if (req.method !== 'POST') {
		return res.status(400).send({message: 'Only POST requests allowed'})
	}

	// Collect firebase + supabase tokens from the request
	const {tokenFirebase, tokenSupabase} = req.body
	if (!tokenFirebase || !tokenSupabase) {
		return res.status(403).send({message: 'Missing token'})
	}

	// Verify both
	try {
		const firebaseIsValid = await verifyFirebaseToken(tokenFirebase)
		const supabaseIsValid = await verifySupabaseToken(tokenSupabase)
		console.log(firebaseIsValid, supabaseIsValid)
		if (firebaseIsValid && supabaseIsValid) {
			res.status(200).send({message: 'Tokens are valid'})
		} else {
			res.status(403).send({message: 'Tokens are not valid'})
		}
	} catch (err) {
		console.log(err)
		res.status(403).send({message: 'Could not verify tokens'})
	}
}

function verifyFirebaseToken(idToken) {
	return getAuth().verifyIdToken(idToken)
}

async function verifySupabaseToken(access_token) {
	const {user} = await supabase.auth.api.getUser(access_token)
	return user
}
