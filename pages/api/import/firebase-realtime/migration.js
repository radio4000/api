import postgres from 'lib/providers/postgres-admin'
import {getUserExport} from 'lib/providers/firebase-admin'
import {insertChannel, insertUserChannel, insertTrack, insertChannelTrack, insertFollower} from './queries'

// Reset database for debugging. Doesn't touch auth users.
// Because queries will fail if something exists with same ids.
// which order tho? channeltrack, channels, tracks, userchannel? or channels user_channel tracks channel_track
export function resetDb() {
	console.log('RESETTING THE DATABASE')
	return postgres.query(`
		DELETE FROM channel_track;
		DELETE FROM channels;
		DELETE FROM tracks;
		DELETE FROM user_channel;
		DELETE FROM accounts;
		DELETE FROM auth.users;
		DELETE FROM tracks;
	`)
}

/**
 * Migrates a user + channel + tracks + favorites + followers from Firebase to an existing Supabase user.
 * @param {object} props
 * @property {object} userFirebase
 * @property {string} userFirebase.uid
 * @property {object} userSupabase
 * @property {string} userSupabase.id
 * @returns
 */
export async function migrate({userFirebase, userSupabase}) {
	// Fetch data to migrate from Firebase.
	const {channel, tracks, favorites, followers} = await getUserExport(userFirebase.uid)

	try {
		await runQueries({
			supabaseUserId: userSupabase.id,
			channel,
			tracks,
			favorites,
			followers,
		})
	} catch (err) {
		console.log('failed queries', err)
		throw Error(err)
	} finally {
		// See https://node-postgres.com/features/pooling
		// Correction: dont think we need to do this manually
		// await postgres.pool.end()
	}

	// What to return?
	// maybe a nice export package, the user can take away (as they are logged in)
	// "this is all we had on you", your data in a json tree ^^
	return true
}

export async function runQueries({supabaseUserId, channel, tracks, favorites, followers}) {
	if (!supabaseUserId) throw Error('A supabase user id is required')
	if (!channel) throw Error('A channel is required')

	// Insert channel
	let newChannelId
	try {
		const res = await postgres.query(insertChannel(channel, favorites, followers))
		newChannelId = res.rows[0].id
	} catch (err) {
		throw Error(err)
	}

	// Insert user_channel
	try {
		await postgres.query(insertUserChannel(supabaseUserId, newChannelId))
	} catch (err) {
		console.log('debuggerrrr', supabaseUserId, newChannelId)
		throw Error(err)
	}

	// Insert favorites
	if (favorites) {
		// console.log('not inserting favorites', favorites)
		// @todo turn `favorites` (list of firebase channel ids) into list of supabase channel ids.
		// const queries = favorites.map((id) => postgres.query(insertFollower(newChannelId, id)))
		// const results = await Promise.all(queries)
		// console.log('favorites', results)
	}

	// Insert followers
	if (followers) {
		// console.log('not inserting followers', followers)
		// const queries = followers.map((id) => postgres.query(insertFollower(id, newChannelId)))
		// const results = await Promise.all(queries)
		// console.log('followers', results)
	}

	// Insert tracks
	if (!tracks) return
	let newTracks
	try {
		// @todo: maybe here do not filter out tracks with no url, but default empty string?
		// can user have track with no url? maybe used (by users) as a marker of sections?
		// i guess yea. but then we'd have to support in player etc etc <- does it not skip next already?
		// we can test import/export for a while anyways, not ready to launch <-- yep
		// i think the tracks without url are corrupt db entries. we require url otherwise
		const trackQueries = tracks
			// .slice(0, 20) // @TODO REMOVE
			.filter((t) => t.url)
			.map((track) => postgres.query(insertTrack(track)))

		// @todo: maybe find a way to make sure all tracks are inserted; if fail, insert none?
		// maybe it is in the postgres.query settings, or these mutation/procedure or what not
		const results = await Promise.all(trackQueries)
		newTracks = results.map((result) => {
			return {
				id: result.rows[0].id,
				created_at: result.rows[0].created_at,
			}
		})
	} catch (err) {
		// That is handled here I believe. Because of the promise all
		// i am not sure, i think there is maybe something specific in sql world
		throw Error(err)
	}

	try {
		const channelTrackQueries = newTracks.map((track) =>
			postgres.query(insertChannelTrack(supabaseUserId, newChannelId, track.id, track.created_at))
		)
		await Promise.all(channelTrackQueries)
	} catch (err) {
		throw Error(err)
	}

	return {title: channel.title, newChannelId, oldChannelirebaseId: channel.firebase_id}
}
