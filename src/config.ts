export interface Env {
  // Variables (set in wrangler.toml)
  RADIO4000_URL: string
  RADIO4000_CMS: string
  CLOUDINARY_URL: string

  // Secrets (set via wrangler secret put)
  YOUTUBE_API_KEY: string
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}
