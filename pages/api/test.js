import { requireFirebaseSession } from 'utils/firebase-admin'
// import { requireSupabaseSession } from 'utils/supabase-admin'

function handler (req, res) {
	res.status(200).send({message: 'If you did not auth with supabase, you should not see this'})
}

// export default requireSupabaseSession(handler)
export default requireFirebaseSession(handler)
