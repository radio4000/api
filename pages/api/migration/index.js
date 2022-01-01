import fs from 'fs'
import getFirebase from './firebase.js'
import postgresClient from './postgres.js'
import migrate from './migrate.js'

// Uncomment to use a whitelist for importing.
const whitelist = ['facebook:10152422494934521', 'google:109082707013786319045']

const logs = {
	start: 0,
	end: 0,
	duration: 0,
	ok: [],
	failed: [],
	skipped: [],
}

const main = async () => {
	const firebaseDatabase = await getFirebase(logs, whitelist)

	const db = firebaseDatabase //.slice(0, 1000)

	console.log(`Migrating ${db.length} users with channel and tracks...`)

	const startTime = await postgresClient.query('SELECT NOW()')
	await migrate({firebaseDatabase: db, postgresClient, logs})
	const endTime = await postgresClient.query('SELECT NOW()')

	logs.start = new Date(startTime.rows[0].now).getTime()
	logs.end = new Date(endTime.rows[0].now).getTime()
	logs.duration = logs.end - logs.start
	console.log(`Migration ended in ${logs.duration / 1000} seconds`)
	console.log(`${logs.ok.length} ok, ${logs.failed.length} failed, ${logs.skipped.length} skipped.`)
	fs.writeFileSync('./pages/api/migration/output/logs.json', JSON.stringify(logs, null, 2), 'utf-8')

	await postgresClient.pool.end()
}

main()
