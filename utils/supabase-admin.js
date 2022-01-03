import {createClient} from '@supabase/supabase-js'
import config from 'utils/config'

const {SUPABASE_URL, SUPABASE_ANON_KEY} = config

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const verifySupabaseToken = async (access_token) => {
	return supabaseClient.auth.api.getUser(access_token)
}

export default supabaseClient
