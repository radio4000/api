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
	const userFirebase = await verifyFirebaseToken(tokenFirebase)
	if (!userFirebase)
		return res.status(401).json({
			message: 'Not signed in firebase@r4; ?tokenFirebase=',
		})
	req.userFirebase = userFirebase
	return fn(req, res)
}

/* require firebase auth and auth.channels[0] */
// const requireFirebaseChannel = (fn) => {
// 	return requireFirebaseSession(async (req, res) => {
// 		const userChannel = await getUserChannel(req.userFirebase)
// 		req.channelFirebase = userChannel
// 		return fn(req, res)
// 	})
// }
