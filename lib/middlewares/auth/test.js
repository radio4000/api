// require a Radio4000 anonymous token for authentication
export const requireRadio4000Anon = (fn) => async (req, res) => {
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

const verifyRadio4000AnonToken = async (token) => {
	if (!token) {
		Promise.reject({
			message: 'You should use <any> token! Only empty is invalid'
		})
	}
	return Promise.resolve({
		user: 'anonymous@r4'
	})
}
