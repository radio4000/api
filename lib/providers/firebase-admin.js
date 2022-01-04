import firebase from 'firebase-admin'
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

const adminClient = initializeApp({
	databaseURL: FIREBASE_DATABASE_URL,
	credential: firebase.credential.cert({
		projectId: FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
		clientEmail: FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
		privateKey: FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
	}),
}, 'admin-client')

export default adminClient
export {
	getAuth,
}
