# Radio4000 API

In two parts, node js endpoints & firebase/cloudinary

## Custom endpoints (node + vercel)

|URL|Description|
|--------|-------|
|https://api.radio4000.com/embed?slug={channelSlug}|Returns an HTML embed with the [radio4000-player](https://github.com/internet4000/radio4000-player)|
|https://api.radio4000.com/oembed?slug={channelSlug}|Returns a `JSON` object following the [oEmbed spec](http://oembed.com/) for a Radio4000 channel. With this, we can add a meta tag to each channel to get rich previews when the link is shared.|
|https://api.radio4000.com/backup?slug={channelSlug}|Returns a full JSON export of a channel|


Here's an example of how to use the oembed:
```html
<link rel="alternate" type="application/json+oembed" href="https://api.radio4000.com/oembed?slug=200ok" title="200ok">
```

## Firebase + Cloudinary endpoints

For more details on the models and data that you can query with Firebase, see https://github.com/internet4000/radio4000-firebase-rules.

Learn more on how to use the Firebase (data) & Cloudinary (images) and Radio4000 API
endpoints in the [firebase rules repository](https://github.com/internet4000/radio4000-firebase-rules).

## Development

To run a local dev server with the api:

- `npm run dev`
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Config with environment variables

The project requires access to Supabase and Firebase databases. 

To get the needed keys for local development, run `vercel env pull .env.local`.

Preview/Staging and Production keys are only defined in the Vercel project. 

## Deployment to production

Vercel autodeploys new commits to https://api.radio4000.com.

## Next.js docs

This is a [Next.js](https://nextjs.org/) project.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
