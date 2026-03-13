import app from '../../../src/index.ts'

Deno.serve((req) => {
	const env = {
		SUPABASE_URL: Deno.env.get('SUPABASE_URL') ?? '',
		SUPABASE_ANON_KEY: Deno.env.get('SUPABASE_ANON_KEY') ?? '',
		YOUTUBE_API_KEY: Deno.env.get('YOUTUBE_API_KEY') ?? '',
		RADIO4000_URL: Deno.env.get('RADIO4000_URL') ?? 'https://radio4000.com',
		CLOUDINARY_URL:
			Deno.env.get('CLOUDINARY_URL') ??
			'https://res.cloudinary.com/radio4000/image/upload',
	}
	return app.fetch(req, env)
})
