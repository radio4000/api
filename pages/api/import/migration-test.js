/* the test */
async function migrateTest({
	userFirebase,
	userSupabase,
}) {
	console.log({
        userFirebase,
        userSupabase
    })
	return Promise.resolve(true)
}

export {
    migrateTest as migrate
}
