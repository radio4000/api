import {verifySupabaseToken} from 'utils/supabase-admin'

// require supabase authentication
export const requireSupabaseSession = (fn) => async (req, res) => {
	const {tokenSupabase} = req.body
	if (!tokenSupabase) {
		return res.status(401).json({
			message: 'Invalid supabase session.access_token; ?tokenSupabase=',
			status: 401,
		})
	}
	const {user, error} = await verifySupabaseToken(tokenSupabase)
	console.log(user, error)
	if (error) {
		return res.status(401).json(error)
	}
	req.userSupabase = user
	return fn(req, res)
}
