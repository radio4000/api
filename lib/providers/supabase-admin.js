import {createClient} from '@supabase/supabase-js'
import config from 'lib/config'

const {SUPABASE_URL, SUPABASE_ANON_KEY} = config

const adminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default adminClient
