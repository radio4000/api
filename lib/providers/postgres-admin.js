import config from 'lib/config'
import pg from 'pg'

const {
	POSTGRES_USER,
	POSTGRES_HOST,
	POSTGRES_PASSWORD,
	POSTGRES_DATABASE,
	POSTGRES_PORT,
} = config

// connect to postgresql
// ENV vars are loaded by default
const pool = new pg.Pool({
	user: POSTGRES_USER,
	host: POSTGRES_HOST,
	database: POSTGRES_DATABASE,
	password: POSTGRES_PASSWORD,
	port: POSTGRES_PORT,
})

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (error) => {
	console.error('Unexpected error on idle client', error)
	process.exit(-1)
})

const postgresClient = {
	pool,

	// See more on https://node-postgres.com/features/queries
	query: (text, params) => {
		return pool.query(text, params)
	},
}

export default postgresClient
