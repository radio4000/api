import postgres from 'lib/providers/postgres-admin'
import {getUserExport} from 'lib/providers/firebase-admin'
import {insertChannel, insertUserChannel, insertTrack, insertChannelTrack} from './queries'

// Reset database for debugging. Doesn't touch auth users.
// Because queries will fail if something exists with same ids.
// which order tho? channeltrack, channels, tracks, userchannel? or channels user_channel tracks channel_track
function resetDb() {
	return postgres.query(`
		DELETE FROM channels;
		DELETE FROM user_channel;
		DELETE FROM tracks;
		DELETE FROM channel_track;
	`)
}
// await postgres.query('DELETE FROM public.channel_track')
// await postgres.query('DELETE FROM public.channels')
// await postgres.query('DELETE FROM public.tracks')
// await postgres.query('DELETE FROM public.user_channel')

export async function migrate({userFirebase, userSupabase}) {
	console.log('running')

	// await resetDb()

	// etch data to migrate from Firebase.
	const {channel, tracks} = await getUserExport(userFirebase.uid)
	if (!channel) throw Error('Missing channel, nothing to export!')

	try {
		await runQueries({
			supabaseUserId: userSupabase.id,
			channel,
			tracks,
		})
	} catch (err) {
		throw Error(err)
	} finally {
		// See https://node-postgres.com/features/pooling
		await postgres.pool.end()
	}

	// What to return?
	// maybe a nice export package, the user can take away (as they are logged in)
	// "this is all we had on you", your data in a json tree ^^
	return true
}

async function runQueries({supabaseUserId, channel, tracks}) {
	if (!supabaseUserId) throw Error('supabaseUserId is required')
	if (!channel) throw Error('channel is required')

	let newChannelId
	try {
		const res = await postgres.query(insertChannel(channel))
		newChannelId = res.rows[0].id
	} catch (err) {
		throw Error(err)
	}

	try {
		await postgres.query(insertUserChannel(supabaseUserId, newChannelId))
	} catch (err) {
		throw Error(err)
	}

	if (!tracks) return

	let newTracks
	try {
		// @todo: maybe here do not filter out tracks with no url, but default empty string?
		// can user have track with no url? maybe used (by users) as a marker of sections?
		// i guess yea. but then we'd have to support in player etc etc <- does it not skip next already?
		// we can test import/export for a while anyways, not ready to launch <-- yep
		// i think the tracks without url are corrupt db entries. we require url otherwise
		const trackQueries = tracks.filter((t) => t.url).map((track) => postgres.query(insertTrack(track)))

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
}
