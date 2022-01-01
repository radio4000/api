/*
	Accepts a body with
	- tokenFirebase
	- tokenSupabase
	get userId{Firebase,Supabase} from token{Firebase,Supabase}
	get channelId from userId{Firebase,Supabase}
	with tracks from channelIdFirebase, add tracks to channelIdSupabase
*/
export default async function migrate(req, res) {
	if (req.method !== 'POST') {
		res.status(400).send({message: 'Only POST requests allowed'})
		return
	}
	// Collect firebase + supabase tokens from the request
	const body = JSON.parse(req.body)
	const {tokenFirebase, tokenSupabase} = body

	// Verify both
	const firebaseIsValid = await verifyFirebaseToken(tokenFirebase)
	const supabaseIsValid = await verifySupabaseToken(tokenSupabase)
	const bothTokensAreValid = firebaseIsValid && supabaseIsValid

	if (bothTokensAreValid) {
		// Then what?!
	}

	// Temporary test reponse while developing
	const data = {just: 'testing', firebaseIsValid, supabaseIsValid}
	res.status(200).json(data)
}

function verifyFirebaseToken(idToken) {
	return new Promise.resolve(false)
	// return getAuth()
	// 	.verifyIdToken(idToken)
	// 	.then((decodedToken) => {
	// 		const uid = decodedToken.uid
	// 		console.log(uid)
	// 		return uid
	// 		// ...
	// 	})
	// 	.catch((error) => {
	// 		console.log(error)
	// 		// Handle error
	// 	})
}

function verifySupabaseToken(token) {
	return new Promise.resolve(false)
}

// import {initializeApp} from 'firebase-admin/app'
// import {getAuth} from 'firebase-admin'
// import {createClient} from '@supabase/supabase-js'

// // init firebase app
// initializeApp({
// 	// credential: credential.cert(serviceAccount),
// 	databaseURL: 'https://radio4000.firebaseio.com',
// })

// const supabaseConfig = {
// 	url: 'https://jbmaibztbxmtrtjzrory.supabase.co',
// 	key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDk1OTgxMSwiZXhwIjoxOTU2NTM1ODExfQ.s2Cr-3AoFxkzQwrPXEx8vcj7eJluK__VK8XKiXsCxT4',
// }

// // init supabase client
// const supabase = createClient(supabaseConfig.url, supabaseConfig.key)
