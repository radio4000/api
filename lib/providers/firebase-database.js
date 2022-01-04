import config from 'lib/config'
import {initializeApp} from 'firebase/app'
import {getDatabase, ref, get, child} from 'firebase/database'

const {
	FIREBASE_DATABASE_URL,
	FIREBASE_WEB_API_KEY
} = config

/*
	Init Firebase database client;
	default client, to make db calls as the user
*/

const defaultClient = initializeApp({
  databaseURL: FIREBASE_DATABASE_URL,
  apiKey: FIREBASE_WEB_API_KEY,
})

/*
	CRUD
*/
async function getUser(userId) {
	const db = getDatabase(defaultClient)

	let user
	try {
		user = await get(child(ref(db), `users/${userId}`))
			.then((snapshot) => {
				if (snapshot.exists()) {
					console.log(snapshot.val());
					return snapshot.val()
				} else {
					console.log("No data available");
				}
			})
	} catch(error) {
		console.error(error)
	}
	console.log(user)
	return user
}

async function getUserExport(userId) {
	return {}
}

export default defaultClient
export {
	getUser,
	getUserExport,
}
