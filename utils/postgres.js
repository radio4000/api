import pg from 'pg'

// connect to postgresql
// ENV vars are loaded by default
const pool = new pg.Pool()

// the pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (error, client) => {
	console.error('Unexpected error on idle client', error)
	process.exit(-1)
})

const postgres = {
	pool,
	query: (text, params) => {
		return pool.query(text, params)
	},
}

export default postgres
