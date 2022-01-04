import postgres from 'lib/postgres'
import {getUserExport} from 'lib/providers/firebase-admin'
import {insertChannel, insertUserChannel, insertTrack, insertChannelTrack} from 'lib/queries'

export async function migrate({userFirebase, userSupabase}) {
	console.log('running')

	// it seems to run now. it's complaining that a channel already exists in the db :O
	// omg
	// omg
	// i have my staging channel on localhost:3000
	// but it didn't move track?
	// now it does
	// tryyyyyyyy

	// Fetch data to migrate from Firebase.
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

export async function runQueries({supabaseUserId, channel, tracks}) {
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
		const trackQueries = tracks.filter((t) => t.url).map((track) => postgres.query(insertTrack(track)))
		const results = await Promise.all(trackQueries)
		newTracks = results.map((result) => {
			return {
				id: result.rows[0].id,
				created_at: result.rows[0].created_at,
			}
		})
	} catch (err) {
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

// Converts the Firebase timestamps to what Postgres wants
// new Date("1411213745028").toISOString()
// ==> "2014-09-20T11:49:05.028Z"
function toTimestamp(timestamp) {
	return new Date(Number(timestamp)).toISOString()
}

// Returns a timestamp from a Postgres datetime
// const getTime = () =>
// 	postgres.query('SELECT now()').then((rows) => {
// 		return new Date(rows[0].now).getTime()
// 	})

// Reset database for debugging. Queries will fail if something exists with same ids.
// await postgres.query('DELETE FROM public.channel_track')
// await postgres.query('DELETE FROM public.channels')
// await postgres.query('DELETE FROM public.tracks')
// await postgres.query('DELETE FROM public.user_channel')

// const logs = {start: await getTime(), end: 0, duration: 0}
// logs.end = getTime()
// logs.duration = logs.end - logs.start
// console.log(`Migration ended in ${logs.duration / 1000} seconds`)
