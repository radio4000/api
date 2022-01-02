import postgres from '../../../utils/postgres.js'
import {insertChannel, insertUserChannel, insertTrack, insertChannelTrack} from './queries.js'
import {findChannel, findTracksByChannel} from '../../../utils/firebase-rest.js'

/*
	What's the plan?
	input firebase channel id + supabase user id
	output postgres: channels, user_channel, tracks, channel_track
*/

export default async function migrate({firebaseChannelId, supabaseUserId}) {
	const logs = {
		start: 0,
		end: 0,
		duration: 0,
		ok: [],
		failed: [],
		skipped: [],
	}

	const startTime = await postgres.query('SELECT NOW()')

	// Fetch Firebase channel and tracks.
	let channel = await findChannel(firebaseChannelId)
	if (!channel) throw new Error('A channel is required to migrate')
	let tracks = await findTracksByChannel(firebaseChannelId)

	// Prepare the data for import into the Postgres.
	channel = serializeChannel(channel)
	tracks = serializeTracks(tracks)

	console.log(
		`Migrating channel "${channel.title}" with ${tracks.length} tracks to Supabase user ${supabaseUserId}`
	)

	try {
		// Clean up
		// await postgres.query('DELETE FROM public.channel_track')
		// await postgres.query('DELETE FROM public.channels')
		// await postgres.query('DELETE FROM public.tracks')
		// await postgres.query('DELETE FROM public.user_channel')
		// await postgres.query('DELETE FROM auth.users')

		await runQueries(postgres, {supabaseUserId, channel, tracks})
		console.log('migrated successfully', supabaseUserId, channel.title)
	} catch (err) {
		console.log('failed to migrate', supabaseUserId, err)
	}

	const endTime = await postgres.query('SELECT NOW()')

	logs.start = new Date(startTime.rows[0].now).getTime()
	logs.end = new Date(endTime.rows[0].now).getTime()
	logs.duration = logs.end - logs.start
	console.log(`Migration ended in ${logs.duration / 1000} seconds`)
	console.log(`${logs.ok.length} ok, ${logs.failed.length} failed, ${logs.skipped.length} skipped.`)

	// Close the connection.
	await postgres.pool.end()
}

async function runQueries(postgres, {supabaseUserId, channel, tracks}) {
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

function serializeChannel(channel) {
	if (!channel) {
		console.log('skipping')
		return false
	}
	channel.created = toTimestamp(channel.created)
	channel.updated = channel.updated ? toTimestamp(channel.updated) : channel.created
	return channel
}

function serializeTracks(tracks) {
	if (tracks.length > 0) {
		tracks = tracks.map((track) => {
			if (!track.title) track.title = 'Untitled'
			track.id = id
			track.created = toTimestamp(track.created)
			return track
		})
	}
	return tracks
}

// new Date("1411213745028").toISOString()
// ==> "2014-09-20T11:49:05.028Z"
function toTimestamp(timestamp) {
	return new Date(Number(timestamp)).toISOString()
}
