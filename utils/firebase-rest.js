// Helpers to make it easier to work with the Radio4000 Firebase database.

function fetchAndParse(url, host = 'https://radio4000.firebaseio.com') {
	return fetch(`${host}/${url}`)
		.then((res) => res.json())
		.then((data) => {
			// Catch resolved promise with empty value. Like non-existing slug or id.
			if (Object.keys(data).length === 0) throw new Error('Not found')
			return data
		})
}

function toObject(obj, id) {
	return Object.assign(obj, {id})
}

function toArray(data) {
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
