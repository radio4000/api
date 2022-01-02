import postgres from 'utils/postgres.js'
import {requireFirebaseSession} from 'utils/firebase-admin'
import {requireSupabaseSession} from 'utils/supabase-admin'

// that wasn't the error

import {insertChannel, insertUserChannel, insertTrack, insertChannelTrack} from 'utils/queries.js'
import {findChannel, findTracksByChannel} from 'utils/firebase-rest.js'

/*
/ create channel firebase
- [ ] will be locked at some point in `Date.now() + XXX`
- [ ] while can create firebase.channels > try import to supabase.channels

/ create channel supabase
- [x] has unique slug
- [ ] has unique slug also in firebase/channels (cms/crud/channel/createChannel())
^ only way to have a channel on supabase from which slug exist on firebase is `importFirebase`

/ migrateFirebaseUser(firebaseUser)
- [X] only runs if user is logged in firebase + supabase
- [ ] only migrate a channel that exist on firebase & not yet on supabase
> but actually, user can change `supabaseChannel.slug`, so we need
- [ ] creates a new supabase channel with tracks on the existing user
-
*/

/*
	To test the endpoint, use this:
	curl -X POST http://localhost:3000/import/firebase -d '{"tokenFirebase":"value1", "tokenSupabase":"value2"}' -H "Content-Type: application/json" -i
*/

async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(400).json({message: 'Only POST requests allowed'})
	}
	// 1. require firebaseUser has a channel
	//     - need the sdk to do this i think, because query user
	// 2. check if supabase.channels exists w/ firebaseChannel.slug
	// 3. (if no supabase.channels[firebaseSlug] migrate?
	// migrate()
	const {user, userFirebase, channelFirebase} = req
	console.log({channelFirebase, userFirebase, userSupabase: user})
	try {
		// const firebaseChannelId = ???
		const supabaseUserId = user.id
		migrate(firebaseChannelId, supabaseUserId)
	} catch (err) {
		console.log(err)
		res.status(500).send({message: 'Could not migrate'})
	}
}
// want to do
// export default requireSupabaseSession(requireFirebaseChannel(handler))
// sure
// nice work gg; could not debug...
// still doesn't work :D;; at least not the error
export default requireSupabaseSession(
	requireFirebaseSession(handler)
	// handler
)







/*
	What's the plan?
	input firebase channel id + supabase user id
	output postgres: channels, user_channel, tracks, channel_track
*/
async function migrate({firebaseChannelId, supabaseUserId}) {
	if (!firebaseChannelId || !supabaseUserId) {
		throw new Error('firebaseChannelId and supabaseUserId are required')
	}

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
		// Clean up. Import will fail if something exists with same ids.
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

// Converts the Firebase timestamps to what Postgres wants
// new Date("1411213745028").toISOString()
// ==> "2014-09-20T11:49:05.028Z"
function toTimestamp(timestamp) {
	return new Date(Number(timestamp)).toISOString()
}
