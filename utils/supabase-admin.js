import {createClient} from '@supabase/supabase-js'
import {
	SUPABASE_URL,
	SUPABASE_ANON_KEY
} from 'utils/config'

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// require supabase authentication
export const requireSupabaseSession = (fn) => async (req, res) => {
	const user = await verifySupabaseToken(req.body.tokenSupabase)
	if (!user) return res.status(401).json({
		message: 'Not signed in to supabase; ?tokenSupabase='
	})
	req.user = user
	return fn(req, res)
}

export const verifySupabaseToken = async (access_token) => {
	const {user} = await supabaseClient.auth.api.getUser(access_token)
	return user
}

export default supabaseClient
