import firebaseAdmin from '../../utils/firebase-admin'
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
	// const body = JSON.parse(req.body)
	// console.log(body)
	const {tokenFirebase, tokenSupabase} = req.body

	// Verify both
	const firebaseIsValid = await verifyFirebaseToken(tokenFirebase)
	const supabaseIsValid = await verifySupabaseToken(tokenSupabase)
	console.log(firebaseIsValid, supabaseIsValid)
	const bothTokensAreValid = tokenFirebase && tokenSupabase

	if (bothTokensAreValid) {
		res.status(200).send('all good')
	} else {
		res.status(403).send('not so good')
	}
}

function verifyFirebaseToken(idToken) {
	// return Promise.resolve(false)
	return getAuth()
		.verifyIdToken(idToken)
		.then((decodedToken) => {
			const uid = decodedToken.uid
			console.log(uid)
			return uid
			// ...
		})
		.catch((error) => {
			console.log(error)
			return false
			// Handle error
		})
}

function verifySupabaseToken(token) {
	return Promise.resolve(false)
}
// const supabaseConfig = {
// 	url: 'https://jbmaibztbxmtrtjzrory.supabase.co',
// 	key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDk1OTgxMSwiZXhwIjoxOTU2NTM1ODExfQ.s2Cr-3AoFxkzQwrPXEx8vcj7eJluK__VK8XKiXsCxT4',
// }

// // init supabase client
// const supabase = createClient(supabaseConfig.url, supabaseConfig.key)
