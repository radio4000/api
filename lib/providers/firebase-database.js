import {initializeApp} from 'firebase/app'
import {getDatabase, ref, child, get} from 'firebase/database'
import config from 'lib/config'

const {
	FIREBASE_DATABASE_URL,
	FIREBASE_WEB_API_KEY
} = config

/*
	Init Firebase clients
	default client, to make db calls as the user
*/

const defaultClient = initializeApp({
  databaseURL: FIREBASE_DATABASE_URL,
  apiKey: FIREBASE_WEB_API_KEY,
}, 'default-client')

/*
	CRUD
*/
async function getUser(firebaseUserUid) {
	const database = getDatabase(defaultClient)
	const dbRef = ref(database)

	console.log('firebaseUserUid', firebaseUserUid)
	let snapshot
	try {
		snapshot = await get(child(dbRef, `users/${firebaseUserUid}`))
	} catch(error) {
		console.log('Error getting firebase user', error)
	}
	if (!snapshot?.exists()) {
		console.log('No firebase user available', snapshot)
		return snapshot
	}
	return snapshot.val()
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

export default defaultClient
export {
	getUser,
	getUserExport
}
