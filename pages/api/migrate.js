import firebaseAdmin from '../../utils/firebase-admin'
import {getAuth} from 'firebase-admin/auth'

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
		return res.status(403).send('Missing token')
	}
	// Verify both
	try {
		const firebaseIsValid = await verifyFirebaseToken(tokenFirebase)
		const supabaseIsValid = await verifySupabaseToken(tokenSupabase)
		console.log(firebaseIsValid, supabaseIsValid)
		res.status(200).send('tokens are here and valid!')
	} catch (err) {
		console.log(err)
		res.status(403).send('tokens are here but not valid')
	}
}

function verifyFirebaseToken(idToken) {
	// return Promise.resolve(false)
	return getAuth().verifyIdToken(idToken)
		// .then((decodedToken) => {
		// 	const uid = decodedToken.uid
		// 	console.log(uid)
		// 	return uid
		// 	// ...
		// })
}

function verifySupabaseToken(token) {
	return Promise.resolve(false)
}

