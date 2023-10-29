// This file contains the SQL queries needed for the Firebase -> Supabase migration.
// All functions return an object with a `text` and `values` property.

// export const insertAuthUser = (id, authUser) => {
// 	const {email, createdAt, passwordHash} = authUser
// 	const provider = {provider: extractProvider(authUser)}
// 	// @todo what about the password salt?
// 	return {
// 		text: `
// 			INSERT INTO auth.users(
// 				id,
// 				instance_id,
// 				aud,
// 				role,
// 				email,
// 				encrypted_password,
// 				email_confirmed_at,
// 				created_at,
// 				updated_at,
// 				last_sign_in_at,
// 				raw_app_meta_data,
// 				raw_user_meta_data,
// 				confirmation_token,
// 				recovery_token,
// 				email_change_token_new,
// 				email_change,
// 				is_super_admin
// 			)
// 			VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
// 			RETURNING id
// 		`,
// 		values: [
// 			id,
// 			'00000000-0000-0000-0000-000000000000',
// 			'authenticated',
// 			'authenticated',
// 			email,
// 			passwordHash,
// 			createdAt,
// 			createdAt,
// 			createdAt,
// 			createdAt,
// 			provider,
// 			{},
// 			'',
// 			'',
// 			'',
// 			'',
// 			false,
// 		],
// 	}
// }

export const insertChannel = (channel, favorites, followers) => {
	const {id, title, slug, body, created, updated, link, image, coordinatesLongitude, coordinatesLatitude} = channel
	return {
		text: 'INSERT INTO channels(firebase_id, name, slug, description, created_at, updated_at, url, image, longitude, latitude, favorites, followers) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id',
		values: [
			id,
			title,
			slug,
			body,
			created,
			updated,
			link,
			image,
			coordinatesLongitude,
			coordinatesLatitude,
			favorites,
			followers,
		],
	}
}

export const insertUserChannel = (userId, channelId) => {
	return {
		text: 'INSERT INTO user_channel(user_id, channel_id) VALUES($1, $2)',
		values: [userId, channelId],
	}
}

export const insertTrack = (track) => {
	const {url, discogsUrl, title, body, created} = track
	return {
		text: 'INSERT INTO tracks(url, discogs_url, title, description, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id, created_at',
		values: [url, discogsUrl, title, body, created],
	}
}

export const insertChannelTrack = (userId, channelId, trackId, createdAt) => {
	return {
		text: 'INSERT INTO channel_track(user_id, channel_id, track_id, created_at) VALUES($1, $2, $3, $4)',
		values: [userId, channelId, trackId, createdAt],
	}
}

// Note: followers is used for both favorites and followers
export const insertFollower = (followerId, channelId) => {
	// console.log('inserting follower id', followerId, 'to channel id', channelId)
	return {
		text: 'INSERT INTO followers(follower_id, channel_id) VALUES($1, $2)',
		values: [followerId, channelId],
	}
}

// Supabase expects {provider: 'email/google/facebook/etc'}
function extractProvider(firebaseUser) {
	return firebaseUser.providerUserInfo.length > 0
		? firebaseUser.providerUserInfo[0].providerId.replace('.com', '')
		: 'email'
}
