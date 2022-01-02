import admin from 'firebase-admin'
import {initializeApp} from 'firebase-admin/app'

// Instead of using a service account file, we load the three required keys
// from the service account file as env vars.
// const serviceAccount = require('path/to/serviceAccountKey.json')
const projectId = process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID
const clientEmail = process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
const formattedPrivateKey = privateKey.replace(/\\n/g, '\n')
// console.log(privateKey)
// console.log(formattedPrivateKey)

// Init Firebase Admin SDK
const firebaseAdmin = initializeApp({
	credential: admin.credential.cert({projectId, clientEmail, privateKey: formattedPrivateKey}),
	databaseURL: 'https://radio4000.firebaseio.com',
})

export default firebaseAdmin
