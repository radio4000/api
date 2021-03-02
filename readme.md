> To get more details on the models and data that you can query with Firebase, see https://github.com/internet4000/radio4000-firebase-rules

This api is currently used at https://api.radio4000.com

# deploy 

It is currently setup on github to autodeploy new commits to vercel.

Otherwise:

- dev: =now .=
- prodction: =now . --prod=

# local build

To run a local dev server with the api:

- =now dev=

# List of endpoints

|URL|Description|
|--------|-------|
|https://api.radio4000.com/embed?slug={channelSlug}|Returns an HTML embed with the [radio4000-player](https://github.com/internet4000/radio4000-player)|
|https://api.radio4000.com/oembed?slug={channelSlug}|Returns a `JSON` object following the [oEmbed spec](http://oembed.com/) for a Radio4000 channel. With this, we can add a meta tag to each channel to get rich previews when the link is shared.|
|https://api.radio4000.com/backup?slug={channelSlug}|Returns a full JSON export of a channel|


Here's an example of how to use the oembed:
```html
<link rel="alternate" type="application/json+oembed" href="https://api.radio4000.com/oembed?slug=200ok" title="200ok">
```
