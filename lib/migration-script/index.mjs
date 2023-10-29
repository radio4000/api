import {writeFileSync} from 'fs'
import firebaseExport from './input/firebase-export.json' assert {type: 'json'}
import firebaseAuthUsersExport from './input/firebase-auth-users-export.json' assert {type: 'json'}
import {resetDb, runQueries} from 'pages/api/import/firebase-realtime/migration'
import supabaseAdminClient from '../providers/supabase-admin'

const CLOUDINARY_URL = 'https://res.cloudinary.com/radio4000'

// Set this to limit the number of users to import.
const LIMIT = 20000

// If true, no data will be inserted.
const DRYRUN = true

const hours = (ms) => Math.floor(ms / 3600000)
const minutes = (ms) =>  Math.floor((ms % 3600000) / 60000)
const seconds = (ms) =>  ((ms % 60000) / 1000).toFixed(3)
const formattedTime = (ms) => `${hours(ms)}h ${minutes(ms)}m ${seconds(ms)}s`

/**
 * The input/firebase-export.json file
 * @typedef {Object} FirebaseExport
 * @property {object} channelPublics
 * @property {object} channels
 * @property {object} tracks
 * @property {object} userSettings
 * @property {object} users
 */

/**
 * The input/firebase-auth-users-export.json file
 * @typedef {Object} FirebaseAuthUser
 * @property {string} localId
 * @property {string} email
 * @property {boolean} emailVerified
 * @property {string} passwordHash
 * @property {string} salt
 * @property {string} lastSignedInAt
 * @property {string} createdAt
 * @property {Array<{providerId: string, rawId: string}>} providerUserInfo
 */

async function main() {
	const t0 = performance.now()

	// STEP ONE (very fast)
	// For every Firebase user, create a "backup" of all data.
	// If the backup contains an "error" prop it is considered invalid.
	const uids = Object.keys(firebaseExport.users).slice(0, LIMIT)
	const backups = uids
		.map((uid, index) => {
			process.stdout.write(`Collecting backup... ${Math.floor((index / uids.length) * 100)}%\r`)
			return getFullBackup(uid)
		})
		.filter((b) => b)
	const validBackups = backups.filter((b) => !b.error)
	const errors = backups.filter((b) => b.error)
	writeFileSync('./log-migrate-backups.json', JSON.stringify(validBackups))
	writeFileSync('./log-migrate-errors.json', JSON.stringify(errors))
	const t1 = performance.now()
	console.log(`${validBackups.length}/${uids.length} ready to insert, ${errors.length} skips. ${seconds(t1 - t0)}s`)

	if (DRYRUN) {
		console.log('Dryrun enabled, stopping before anything is inserted')
		return
	}

	// STEP TWO (quite slow)
	// For every valid backup, first create a Supabase user, and then insert it all into Postgres.
	await resetDb()
	for (const [index, backup] of validBackups.entries()) {
		process.stdout.write(`Inserting... ${Math.floor((index / validBackups.length) * 100)}%\r`)
		try {
			// @todo handle users without an email aka google/facebook providers.
			const user = await createSupabaseUser(backup)
			await runQueries({supabaseUserId: user.id, ...backup})
		} catch (err) {
			console.log(err)
		}
	}
	const t2 = performance.now()
	console.log(`done in ${minutes(t2 - t1)}m ${seconds(t2 -t1)}s`)
	process.exit()
}

main()

async function createSupabaseUser(backup) {
	const email = backup.authUser.email
	const testEmail = `oskar+migrate-${self.crypto.randomUUID()}@rough.dk`
	const res = await supabaseAdminClient.auth.signUp({
		email: testEmail,
		password: 'password',
	})
	if (res.error) {
		console.log('failed to create supabase user', email, testEmail)
		throw Error(res.error.message)
	}
	console.log('created user', email)
	return res.user
}

/**
 * Extracts a full backup from a user
 * @param {string} uid - The Firebase user id
 */
export function getFullBackup(uid) {
	const user = getUser(uid)
	if (!user) return {error: 'no user', uid}
	user.id = uid

	const authUser = getAuthUser(uid)
	if (!authUser) return {error: 'no auth user', uid}

	if (authUser.providerUserInfo?.length) {
		// const {providerId, rawId} = authUser.providerUserInfo[0]
		// "providerId": "google.com",
		// "rawId": "102862690431579666546",
		// @todo somehow handle users with facebook.com or google.com providers.
	}

	if (!authUser.email) return {error: 'no auth user email', uid}
	if (!user.channels) return {error: 'no user channels', uid}

	const cid = Object.keys(user.channels)[0] // first channel's id
	const channel = getChannelById(cid)
	if (!channel) return {error: 'no channel', uid, cid}
	const tracks = getChannelTracks(cid)
	if (!tracks?.length) return {error: 'no channel tracks', uid, cid}
	const favorites = getChannelFavorites(cid)
	const followers = getChannelFollowers(cid)

	// no longer needed
	delete user.channels
	delete channel.tracks
	delete channel.favoriteChannels

	return {user, authUser, channel, tracks, favorites, followers}
}

/**
 * @param {string} uid
 * @returns {object} raw firebase user object
 */
function getUser(uid) {
	return firebaseExport.users[uid]
}

/** @returns {FirebaseAuthUser} */
function getAuthUser(uid) {
	return firebaseAuthUsersExport.users.find((u) => u.localId === uid)
}

function getChannelById(cid) {
	const channel = firebaseExport.channels[cid]
	if (!channel) return
	channel.id = cid
	return serializeChannel(channel)
}

function getChannelTracks(cid) {
	const ids = firebaseExport.channels[cid].tracks
	if (!ids) return []
	const tracks = []
	for (const id of ids) {
		const track = firebaseExport.tracks[id]
		track.id = id
		tracks.push(track)
	}
	return tracks.map(serializeTrack)
}

/**
 * @param {string} cid
 * @returns {Array<string>} list of channel ids
 */
function getChannelFollowers(cid) {
	const channel = firebaseExport.channels[cid]
	const channelPublicId = channel.channelPublic
	const publicChannel = firebaseExport.channelPublics[channelPublicId]
	if (!publicChannel?.followers) return []
	return Object.keys(publicChannel.followers)
}

/**
 * @param {string} cid
 * @returns {Array<string>} list of channel ids
 */
function getChannelFavorites(cid) {
	const channel = firebaseExport.channels[cid]
	if (!channel.favoriteChannels) return []
	return Object.keys(channel.favoriteChannels)
}

/*
	Helpers for serializing firebase data,
	into what Postgres(import) and API@r4 want.
 */

/**
 * @param {object} channel - the firebase channel
 * @returns {object}
 */
function serializeChannel(channel) {
	// Store the original id for reference.
	channel.firebase_id = channel.id

	// Ensure created and updated at exists.
	channel.created = toTimestamp(channel.created)
	channel.updated = channel.updated ? toTimestamp(channel.updated) : toTimestamp(channel.created)

	// Set "imageUrl"
	if (channel.image) channel.imageUrl = `${CLOUDINARY_URL}/image/upload/${channel.image}`

	// Turn tracks object into array of ids.
	if (channel.tracks) channel.tracks = Object.keys(channel.tracks)

	// Clean keys we don't need
	delete channel.images
	delete channel.isFeatured
	delete channel.isPremium

	return channel
}

function serializeTrack(track) {
	if (!track.title) track.title = 'Untitled'
	track.created = toTimestamp(track.created)
	delete track.channel
	return track
}

/* Converts the Firebase timestamps to what Postgres wants:
	new Date("1411213745028").toISOString() ==> "2014-09-20T11:49:05.028Z"
*/
function toTimestamp(timestamp) {
	try {
		return new Date(timestamp).toISOString()
	} catch (err) {
		console.log('toTimestamp', timestamp, err)
	}
}

