import admin from 'firebase-admin'
import {initializeApp} from 'firebase-admin/app'
// import {getAuth} from 'firebase-admin'

// const serviceAccount = require('path/to/serviceAccountKey.json')
const projectId = process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID
const clientEmail = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL
const formattedPrivateKey = privateKey.replace(/\\n/g, '\n')

initializeApp({
	// credential: admin.credential.cert(serviceAccount),
	credential: admin.credential.cert({projectId, clientEmail, privateKey: formattedPrivateKey}),
	databaseURL: 'https://radio4000.firebaseio.com',
})

export default admin
