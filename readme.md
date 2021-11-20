> To get more details on the models and data that you can query with Firebase, see https://github.com/internet4000/radio4000-firebase-rules

# deployment to production

This api is currently used at https://api.radio4000.com

It is currently setup on **vercel to autodeploy with new comits to
this github repository**.

Otherwise (when `cd` in the folder):

- dev: =now .=
- production: =now . --prod=

# local build

To run a local dev server with the api:

- =now dev=

# Radio4000 API
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

## Firebase + Cloudinary enpoints

This is the documentation and public API to
[Radio4000.com](https://radio4000.com). The Radio4000 API consists of
several parts: a Firebase database as well as a node.js API.

Disclaimer: we welcome anyone to use the available data, and to help improve the
ecosystem. Only use this API in ways that respect users' privacy, does
not harm the systems or steps out legality.

In this repository you can find:

- [Firebase API](#firebase-api)
- [Rules & Authentication](#rules--authentication)
- [Endpoints](#endpoints)
- [Models](#models)
- [Node.js API](#nodejs-api)
- [Deployment](#deployment)
- [FAQ](#frequently-and-not-frequently-asked-questions-faqnfaq)

### Firebase API

Thanks to Firebase, the Radio4000 data can be accessed with classic REST as well as realtime through the Firebase SDK. The [Firebase documentation](https://firebase.google.com/docs/) explains how you can access data for various platforms: Web, Android, iOS, C++, Unity. This API supports `GET` HTTP methods. There is no versioning for this API as we have to follow and replicate any changes made at the Firebase level. Note that Firebase stores arrays as objects where the key of each object is the `id` of the model.

### Rules & authentication

The Firebase security rules can be found in `database.rules.json`. This is the most precise definition of what can and should be done with the API. Most endpoints can be read without authentication. Reading a user, a userSettings or writing to (some) models always require authentication. For now, think of the API as read-only.

To deploy the rules see [deployment](#deployment).

### Endpoints

Here's a list of available REST endpoints. They are all available via normal `GET` HTTP requests.

**List of endpoints at https://radio4000.firebaseio.com**.

For *realtime* database access, you should refer to the [Firebase SDK](https://firebase.google.com/docs/) available for your platform.

|URL|Description|
|--------|-------|
|https://radio4000.firebaseio.com/users/{id}.json|All users|
|https://radio4000.firebaseio.com/userSettings/{id}.json|Single user setting|
|https://radio4000.firebaseio.com/channels.json|All channels|
|https://radio4000.firebaseio.com/channels/{id}.json|Single channels|
|https://radio4000.firebaseio.com/channelPublics/{id}.json|All channel publics|
|https://radio4000.firebaseio.com/tracks.json|All tracks from all channels|
|https://radio4000.firebaseio.com/tracks/{id}.json|Single track|

You can see some example usage here https://github.com/internet4000/radio4000-player/blob/master/src/utils/store.js

**List of endpoints at https://api.radio4000.com**.

These come from the node.js app in this repo.

|URL|Description|
|--------|-------|
|https://api.radio4000.com/embed?slug={channelSlug}|Returns an HTML embed with the [radio4000-player](https://github.com/internet4000/radio4000-player)|
|https://api.radio4000.com/oembed?slug={channelSlug}|Returns a `JSON` object following the [oEmbed spec](http://oembed.com/) for a Radio4000 channel. With this, we can add a meta tag to each channel to get rich previews when the link is shared.|
|https://api.radio4000.com/backup?slug={channelSlug}|Returns a full JSON export of a channel|

The `/embed` endpoint is meant to be used as the `src` of our `<iframe>` embeds. To get the HTML for the iframe embed, visit the `/oembed` endpoint and see the `html` property.

Here's an example of how to use the oembed:
```html
<link rel="alternate" type="application/json+oembed" href="https://api.radio4000.com/oembed?slug=200ok" title="200ok">
```

### Models

Listed below are all available models and their properties. Also see this folder https://github.com/internet4000/radio4000/tree/master/app/models.

- [user](#user)
- [userSetting](#usersetting)
- [channel](#channel)
- [channelPublic](#channelpublic)
- [track](#track)

#### user

Requires authentication to read and write.

|name|type|description|
|----|----|----|
|channels|`hasMany`|list of radio `channel`s belonging to a user. We only allow one, for now. Example: `{"-KYJykyCl6nIJi6YIuBO": true}`|
|created|`integer`|timestamp from when the user was created. Example: `1481041965335`|
|settings|`belongsTo`|relationship to a `userSetting` model. Example: `-KYJyixLTbITr103hovZ`|

#### userSetting

Requires authentication to read and write.

|name|type|description|
|----|----|----|
|user|`belongsTo`|Relationship to a single `user` model. Example: `"fAE1TRvTctbK4bEra3GnQdBFcqj2"`|

#### channel

Requires authentication to write.

|name|type|description|
|----|----|----|
|body|`string`|description of the radio channel. Example: `"The channel of your wet dreams..."`|
|channelPublic|`belongsTo`|relationship to a `channelPublic`. Example: `"-JoJm13j3aGTWCT_Zbir"`|
|created|`integer`|timestamp describing when was this radio channel created. Example: `"1411213745028"`|
|favoriteChannels|`hasMany`|list of channels this radio has added as favorite. Example: `"-JXHtCxC9Ew-Ilck6iZ8": true`|
|image|`string`|the id for the cloudinary `image` model. Example: `"image": "drz0qs9lgscyfdztr17t". See Image section for more info`|
|isFeatured|`boolean`|whether this channel is featured on Radio4000's homepage. Example: `false`|
|link|`string`|Custom URL describing the external homepage for a radio channel. Example: `"https://example.com"`|
|slug|`string`|the unique URL representing this channel. Used for human readable urls radio4000.com/pirate-radio). Example: `"pirate-radio"`|
|title|`string`|title representing a radio channel. Example: `"Radio Oskar"`|
|tracks|`hasMany`|list of `track` models. Example: `{"-J_GkkhzfbefhHMqV5qi": true, ...}`|
|updated|`integer`|timestamp when the radio was last updated. Example: `1498137205047`|

#### channelPublic

`channelPublic` is a model always associated to a `channel` model. It is used so any authenticated user can associate data to a `channel`, when a `channel` can only be written by its owner. For exemple, adding a radio as follower will be done on the `channelPublic` model.

|name|type|description|
|-|-|-|
|channel|`belongsTo`|relationship to a `channel` model. Example: `"-JYEosmvT82Ju0vcSHVP"`|
|followers|`hasMany`|list of `channel` models following this radio. Example: `{"-JXHtCxC9Ew-Ilck6iZ8": true, ...}`|


#### Track

|name|type|description|
|-|-|-|
|body|`string`|optional description to the track. Example: `"Post-Punk from USA (NY)"`|
|channel|`belongsTo`|relationship to `channel` model|
|created|`integer`|date timestamp from when the model is created|
|title|`string`|required title of the track. Example: `"Lydia Lunch - This Side of Nowhere (1982)"`|
|url|`string`|the URL pointing to the provider serving the track media (YouTube only). Example: `"https://www.youtube.com/watch?v=5R5bETC_wvA"`|
|ytid|`string`|provider id of a track media (YouTube only). Example: `"5R5bETC_wvA"`|
|mediaNotAvailable|`boolean`|is the current track media available, accessible to be consumed|
|discogsUrl|`string`|the URL pointing to the Discogs release (or master) corresponding to this track media. Example: `"https://www.discogs.com/Nu-Guinea-Nuova-Napoli/master/1334042"`|

#### Image

For simplicity and focus of usages, a radio can only have one image.  
In attent of a better solution, images are hosted at Cloudinary.

``` javascript
let width = 500,
height = 500,
quality = 100,
id = 'drz0qs9lgscyfdztr17t';

let base = `https://res.cloudinary.com/radio4000/image/upload/w_${width},h_${height},c_thumb,q_${quality}`;
let image = `${base},fl_awebp/${id}.webp`;
```

The whole API is described in details on the [Cloudinary
documentation](https://cloudinary.com/documentation).

You can check how [Radio4000 uses it](https://github.com/internet4000/radio4000/blob/master/app/helpers/cover-img.js).
