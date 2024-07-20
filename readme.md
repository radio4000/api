# Radio4000 API

This is the [radio4000-api](https://github.com/radio4000/api).

## Endpoints

A list of all endpoints exposed by the API.
The base URL is https://api.radio4000.com/.

As of April 2024 we introduced v2: https://api.radio4000.com/v2.

### /api [GET]
Query parameters [optional] :
- `channelSlug={channel-slug}`
- `channelId={channel-id}`
- `trackId={track-id}`

The root API endpoint, to learn about the API.
It can be prefilled with channel/track data.

### /api/embed [GET]
Query parameter:
- `slug={channel-slug}`

An HTML embed with the [radio4000-player](https://github.com/internet4000/radio4000-player)

Example usage of the embed player:
```html
<iframe src="https://api.radio4000.com/embed?slug=oskar" width="320" height="500" frameborder="0"></iframe>
```

### /api/oembed [GET]
Query parameter:
- `slug={channel-slug}`

A `JSON` object following the [oEmbed spec](http://oembed.com/) for a Radio4000 channel.
With this, we can add a meta tag to each channel to get rich previews when the link is shared.

Example usage the oembed data:
```html
<link rel="alternate" type="application/json+oembed" href="https://api.radio4000.com/oembed?slug=oskar" title="oskar">
```

### /api/backup [GET]
Query parameter:
- `slug={channel-slug}`

Provides a full JSON export of a channel data.

### /api/import/firebase-realtime [POST] [authenticated]
Query parameter:
- `tokenFirebase={firebase-user-access-token}`
- `tokenSupabase={supabase-user-access-token}`

Imports a Firebase user data to a Supabase instance.

### /api/youtube [GET]
Query parameter:
- `id={youtube video id}`
	
Returns various info from the YouTube API about a video

### /api/v2/backup [GET]
Query parameter:
- `slug={channel-slug}`

Returns all the data for a single channel and all its tracks.

### /api/v2/embed [GET]
Query parameter:
- `slug={channel-slug}`

An HTML embed with the radio4000/components.

## Test the API endpoints
To test querying data from the endpoints, you can use:
```
curl http://api.radio4000.com/api
curl http://api.radio4000.com/api -i
curl -X GET http://api.radio4000.com/api/embed?slug=oskar
curl -X POST http://api.radio4000.com/api/import/firebase-realtime -d '{"tokenFirebase":"value1", "tokenSupabase":"value2"}' -H "Content-Type: application/json" -i
```

## Development & contributions
This project uses the framework [Next.js](https://nextjs.org/).

1. Clone the git(hub) repository for this project
2. Run a local dev server with the api `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result of your changes

### Environment variables configuratoin
The project requires access to a Supabase project (and Firebase realtime database for legacy or migration, as well as Youtube for automatic info fetching).

To get the needed keys for local development, you can either:
- [all] copy and fill the `.env.local.example` file into a `.env.local` file
- [team] run `vercel env pull .env.local`.

Docs: https://vercel.com/docs/concepts/projects/environment-variables

### Deployment to production

The `main` branch auto-deploys to https://api.radio4000.com  via the `internet4000` team on Vercel.

## Notes

### [Legacy] Firebase & Cloudinary
See https://github.com/internet4000/radio4000-firebase-rules for more details on the models, rules and data accessible with Google Firebase (realtime database) and Cloudinary (images CDN).
