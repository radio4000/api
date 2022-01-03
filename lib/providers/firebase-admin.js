import firebase from 'firebase-admin'
import {initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getDatabase, ref, child, get} from 'firebase-admin/database'
import config from 'lib/config'

const {
	FIREBASE_DATABASE_URL,
	FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
	FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
	FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
} = config

/*
	Init Firebase Admin SDK
*/
const adminClient = initializeApp({
	databaseURL: FIREBASE_DATABASE_URL,
	credential: firebase.credential.cert({
		projectId: FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
		clientEmail: FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
		privateKey: FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
	}),
})

const dbRef = ref(getDatabase())

/*
	CRUD
*/
async function getUser(firebaseUserUid) {
	return get(child(dbRef, `users/${firebaseUserUid}`)).then((snapshot) => {
		if (snapshot.exists()) {
			return snapshot.val()
		} else {
			console.log('No firebase user available')
		}
	})
}

// aka user.channels[0]
async function getUserChannel(firebaseUserUid) {
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

// select * from tracks where channel = channelId
async function getChannelTracks(channelId) {
	return await get(query(ref(db, 'tracks'), orderByChild('channel'), equalTo(channelId)))
}

async function getUserExport(id) {
	const user = await getUser(id)
	const channel = await getUserChannel(id)
	const tracks = await getChannelTracks(channel.id)
	return {user, channel, tracks}
}

export default adminClient
export {getAuth, getUser, getUserExport}
