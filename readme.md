# Radio4000 API

The [Radio4000](https://radio4000.com) API, running on Cloudflare Workers.

## Endpoints

Base URL: https://api.radio4000.com

### / [GET]
API info and documentation links.

### /embed [GET]
- `slug={channel-slug}`

HTML embed with the [radio4000-player](https://github.com/internet4000/radio4000-player).

```html
<iframe src="https://api.radio4000.com/embed?slug=oskar" width="320" height="500" frameborder="0"></iframe>
```

### /oembed [GET]
- `slug={channel-slug}`

[oEmbed spec](http://oembed.com/) JSON for rich previews.

```html
<link rel="alternate" type="application/json+oembed" href="https://api.radio4000.com/oembed?slug=oskar" title="oskar">
```

### /backup [GET]
- `slug={channel-slug}`

Full JSON export of a channel and its tracks.

### /youtube [GET]
- `id={youtube-video-id}`

YouTube video metadata.

### /search-youtube [GET]
- `query={search-term}`

Search YouTube videos.

### /v2 [GET]
V2 API info.

### /v2/embed [GET]
- `slug={channel-slug}`

HTML embed with [@radio4000/components](https://github.com/radio4000/components).

### /v2/backup [GET]
- `slug={channel-slug}`

Channel and tracks export (same as /backup).

## Development

1. Clone the repository
2. Install dependencies: `bun install`
3. Start dev server: `bun run dev`
4. Open http://localhost:8787

### Environment variables

The `.env` file contains the required secrets:

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anon key
- `YOUTUBE_API_KEY` - YouTube Data API key

### Testing

```bash
bun run test              # test against production
bun run test:local        # test against localhost:8787
```

## Deployment

Secrets must be set on Cloudflare:

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put YOUTUBE_API_KEY
```

Deploy:

```bash
bun run deploy
```
