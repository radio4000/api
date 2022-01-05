import {getAuth} from 'lib/providers/firebase-admin'

// verify a user is logged in
const verifyFirebaseToken = async (idToken) => {
	return getAuth().verifyIdToken(idToken)
}

// require firebase authentication
export const requireFirebaseSession = (fn) => async (req, res) => {
	if (req.method === 'OPTIONS') {
		res.status(200).end()
		return fn(req, res)
	}
	const {tokenFirebase} = req.body
	if (!tokenFirebase) {
		return res.status(401).json({
			message: 'Invalid firebase user.accessToken; ?tokenFirebase=',
			status: 401,
		})
	}
	let userFirebase
	try {
		userFirebase = await verifyFirebaseToken(tokenFirebase)
	} catch (error) {
		console.error(error)
		return res.status(401).json(error)
	}

	if (!userFirebase) {
		return res.status(401).json({
			message: 'No firebase@r4 user for this token; Use a valid ?tokenFirebase=',
		})
	}

	// add the user to the request
	req.headers['Authorization'] = 'Bearer ' + tokenFirebase
	req.userFirebase = userFirebase
	return fn(req, res)
}
