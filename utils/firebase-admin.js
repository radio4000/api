import firebase from 'firebase-admin'
import {initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getDatabase, ref, child, get} from 'firebase-admin/database'
import config from 'utils/config'

const {
	FIREBASE_DATABASE_URL,
	FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
	FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
	FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,

} = config

/*
	Init Firebase Admin SDK
*/
const firebaseAdminClient = initializeApp({
	databaseURL: FIREBASE_DATABASE_URL,
	credential: firebase.credential.cert({
		projectId: FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
		clientEmail: FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
		privateKey: FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
	}),
})

const dbRef = ref(getDatabase())

/*
	Auth middlewares
*/
// verify a user is logged in
export const verifyFirebaseToken = async (idToken) => {
	return getAuth().verifyIdToken(idToken)
}

// require firebase authentication
export const requireFirebaseSession = (fn) => async (req, res) => {
	const userFirebase = await verifyFirebaseToken(req.body.tokenFirebase)
	if (!userFirebase) return res.status(401).json({
		message: 'Not signed in r4@firebase; ?tokenFirebase='
	})
	req.userFirebase = userFirebase
	return fn(req, res)
}

// require firebase auth and auth.channels[0]
export const requireFirebaseChannel = requireFirebaseSession((fn) => async (req, res) => {
	const userChannel = await getUserChannel(req.userFirebase)
	req.channelFirebase = userChannel
	return fn(req, res)
})

/*
	CRUD
*/
const getUser = async (firebaseUserUid) => {
	return get(child(dbRef, `users/${firebaseUserUid}`)).then((snapshot) => {
		if (snapshot.exists()) {
			return snapshot.val()
		} else {
			console.log('No firebase user available')
		}
	})
}

const getUserChannel = async (firebaseUserUid) => {
	const user = await getUser(firebaseUserUid)
	const channels = user.channels
	const channelId = Object.keys(channels)[0]
	return get(child(dbRef, `channels/${channelId}`)).then((snapshot) => {
		if (snapshot.exists()) {
			return snapshot.val()
		} else {
			console.log('No firebase user.channel available')
		}
	})
}

export default firebaseAdminClient