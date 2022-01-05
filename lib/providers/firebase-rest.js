import config from 'lib/config'

const {FIREBASE_DATABASE_URL} = config

// Helpers to make it easier to work with the Radio4000 Firebase database.

// 5 second timeout:

async function fetchAndParse(url) {
	const host = FIREBASE_DATABASE_URL

	// stop the request if hanging
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 600)

	let data = {}
	try {
		let res = await fetch(`${host}/${url}`, {
			signal: controller.signal
		})
		if (res) {
			data = await res.json()
		}
	} catch(error) {
		console.error('Error fetching with firebase-rest api', error)
	}
	return data
}

export function toObject(obj, id) {
	return Object.assign(obj, {id})
}

export function toArray(data) {
	return Object.keys(data).map((id) => toObject(data[id], id))
}

export function findChannel(id) {
	const url = `channels/${id}.json`
	return fetchAndParse(url).then((obj) => toObject(obj, id))
}

export function findTracksByChannel(id) {
	const url = `tracks.json?orderBy="channel"&startAt="${id}"&endAt="${id}"`
	// Firebase queries through REST are not sorted.
	return fetchAndParse(url)
		.then(toArray)
		.then((arr) => arr.sort((a, b) => a.created - b.created))
}

export function findChannelBySlug(slug) {
	const url = `channels.json?orderBy="slug"&equalTo="${slug}"`
	return fetchAndParse(url).then(toArray).then((arr) => arr[0])
}
