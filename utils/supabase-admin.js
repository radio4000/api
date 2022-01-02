import {createClient} from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_ANON_KEY
const supabaseClient = createClient(url, key)

export const verifySupabaseToken = async (access_token) => {
	const {user} = await supabaseClient.auth.api.getUser(access_token)
	return user
}

// require supabase authentication
export const requireSupabaseSession = (fn) => async (req, res) => {
	const user = await verifySupabaseToken(req.body.tokenSupabase)
	if (!user) return res.status(401).json({
		message: 'Not signed in to supabase; ?tokenSupabase='
	})
	req.user = user
	return fn(req, res)
}

export default supabaseClient
