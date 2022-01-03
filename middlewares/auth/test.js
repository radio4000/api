// require a testToken authentication
export const requireTestSession = (fn) => async (req, res) => {
	const {tokenTest} = req.body
	if (!tokenTest) {
		return res.status(401).json({
			message: 'Invalid radio4000; ?tokenTest=',
			status: 401,
		})
	}
	const {user, error} = await verifyTestToken(tokenTest)
	if(error || !user) {
		return res.status(401).json({
			message: 'Invalid radio4000 tokenTest',
			status: 401,
		})
	}

	req.userTest = user
	return fn(req, res)
}

const verifyTestToken = async (token) => {
	if (!token) {
		Promise.reject({
			message: 'You should use <any> token! Only empty is invalid'
		})
	}
	return Promise.resolve({
		user: 'anonymous@r4'
	})
}
