// https://firebase.google.com/docs/database/admin/start
import firebaseAdmin from 'firebase-admin'
import {initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getDatabase} from 'firebase-admin/database'
import config from 'lib/config'

const {
	FIREBASE_DATABASE_URL,
	FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
	FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
	FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
} = config

/*
	Init Firebase admin clients,
	 used to verify user authentication sessions
 */

// if (!firebaseAdmin.apps.length) {
// no need to save, app is initialized
initializeApp({
	databaseURL: FIREBASE_DATABASE_URL,
	credential: firebaseAdmin.credential.cert({
		projectId: FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
		clientEmail: FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
		privateKey: FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
	}),
})
// }

async function getUser(uid) {
	const db = getDatabase()
	const snapshot = await db.ref(`users/${uid}`).once('value')
	return snapshot.val()
}

async function getChannel(id) {
	const db = getDatabase()
	const snapshot = await db.ref(`channels/${id}`).once('value')
	return snapshot.val()
}

async function getChannelTracks(channelId) {
	const db = getDatabase()
	const snapshot = await db.ref(`tracks`).orderByChild('channel').equalTo(channelId).once('value')
	return snapshot.val()
}

async function getUserExport(uid) {
	const user = await getUser(uid)
	const channelId = Object.keys(user.channels)[0]
	const channel = await getChannel(channelId)
	const tracks = await getChannelTracks(channelId)
	return {user, channel, tracks}
}

export default adminClient
export {getAuth, getUser, getUserExport}
