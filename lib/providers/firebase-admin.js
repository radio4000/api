// https://firebase.google.com/docs/database/admin/start
import firebaseAdmin from 'firebase-admin'
import {initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import config from 'lib/config'

const {
	FIREBASE_DATABASE_URL,
	FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
	FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
	FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
} = config

/*
	Init Firebase admin clients,
	 used to verify user authentication sessions
 */

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
	var db = firebaseAdmin.database()
	var ref = db.ref(`users/${uid}`)
	return ref.once('value', function(snapshot) {
		console.log('@firebase/users/:uid', snapshot.val())
		return snapshot.val()
	});
}

async function getUserExport(uid) {
	return await getUser(uid)
}



export default adminClient
export {
	getAuth,
	getUser,
	getUserExport,
}
