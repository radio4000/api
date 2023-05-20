/* Firebase Admin client
	 Docs
	 https://firebase.google.com/docs/reference/admin/
	 https://firebase.google.com/docs/database/admin/start

	 The `firebase-admin/database` extends:
	 https://firebase.google.com/docs/reference/js/v8/firebase.database.Database
*/
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
	CLOUDINARY_URL,
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

async function getUser(uid) {
	const db = getDatabase()
	const snapshot = await db.ref(`users/${uid}`).once('value')
	const user = snapshot.val()
	user.id = uid
	return user
}

async function getChannel(id) {
	const db = getDatabase()
	const snapshot = await db.ref(`channels/${id}`).once('value')
	return serializeChannel(snapshot.val())
}

async function getChannelBySlug(slug) {
	const db = getDatabase()
	const snapshot = await db.ref(`channels`).orderByChild('slug').equalTo(slug).limitToFirst(1).once('value')
	// getting a list rsponse, we want the 1st (only) element that has this `slug`
	const channel = toArray(snapshot.val())[0]
	return serializeChannel(channel)
}

async function getChannelTracks(channelId) {
	const db = getDatabase()
	const snapshot = await db.ref(`tracks`).orderByChild('channel').equalTo(channelId).once('value')
	return serializeTracks(snapshot.val())
}

// Returns a list of channel ids. These are the channels that follow the given channel.s
async function getChannelFollowers(channelId) {
	const db = getDatabase()
	const channelPublicId = (await db.ref(`channels/${channelId}/channelPublic`).once('value')).val()
	const snapshot = (await db.ref(`/channelPublics/${channelPublicId}/followers`).once('value')).val()
	return Object.keys(snapshot || {})
}

async function getChannelFavorites(channelId) {
	const db = getDatabase()
	const snapshot = await db.ref(`channels/${channelId}/favoriteChannels`).once('value')
	return Object.keys(snapshot.val() || {})
}

async function getUserExport(uid) {
	const user = await getUser(uid)
	if (!user) throw new Error('Could not find user', uid)
	const db = getDatabase()
	const channelId = Object.keys(user.channels)[0]
	const channelSlug = await (await db.ref(`/channels/${channelId}/slug`).once('value')).val()
	const backup = await getBackup(channelSlug)
	delete user.favoriteChannels
	return {
		user,
		...backup,
	}
}

async function getBackup(channelSlug) {
	const channel = await getChannelBySlug(channelSlug)
	const tracks = await getChannelTracks(channel.id)
	delete channel.tracks // don't need the ids here, since we have them in `tracks`
	const favorites = await getChannelFavorites(channel.id)
	delete channel.favoriteChannels
	const followers = await getChannelFollowers(channel.id)
	return {channel, tracks, favorites, followers}
}

/* serialize functions all expect a `snapshot.val()` firebase-admin value */
function serializeChannel(channel) {
	if (!channel) return null
	channel.firebase_id = channel.id
	channel.created = toTimestamp(channel.created)
	channel.updated = channel.updated ? toTimestamp(channel.updated) : channel.created

	if (channel.image) {
		channel.imageUrl = `${CLOUDINARY_URL}/image/upload/${channel.image}`
	}

	if (channel.favoriteChannels) {
		channel.favoriteChannels = Object.keys(channel.favoriteChannels)
	}

	if (channel.tracks) {
		channel.tracks = Object.keys(channel.tracks)
	}

	/* clean keys we don't need */
	delete channel.images
	// delete channel.channelPublic
	delete channel.isFeatured
	delete channel.isPremium

	return channel
}

function serializeTracks(tracks) {
	if (!tracks) return null
	tracks = toArray(tracks)
	if (tracks.length > 0) {
		tracks = tracks.map((track) => {
			if (!track.title) track.title = 'Untitled'
			track.created = toTimestamp(track.created)
			delete track.channel
			return track
		})
	}
	return tracks
}

/*
	Helpers for serializing firebase data,
	into what Postgres(import) and API@r4 want.
 */

/* Converts the Firebase timestamps to what Postgres wants:
	new Date("1411213745028").toISOString() ==> "2014-09-20T11:49:05.028Z"
*/
function toTimestamp(timestamp) {
	return new Date(Number(timestamp)).toISOString()
}
export function toObject(obj, id) {
	return Object.assign(obj, {id})
}
export function toArray(data) {
	return Object.keys(data).map((id) => toObject(data[id], id))
}

export {getAuth, getUserExport, getChannelBySlug, getBackup as getChannelBackup}
