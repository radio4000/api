/** @type {import('next').NextConfig} */
const nextConfig = {
	// https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
	// reactStrictMode: true,

	// Allow import of markdown files (used for / page of api)
	webpack: (config) => {
		config.module.rules.push({
			test: /\.md$/,
			use: 'raw-loader',
		})
		return config
	},

	// URL rewrites, source -> destination (proxy)
	async rewrites() {
		return [
			// all endpoint work from / and /api, for legacy firebase
			// /api should be used as default now? (!)
			{
				source: '/:path',
				destination: '/api/:path',
			},
			// what's this?
			{
				source: '/api/(.*)',
				destination: '/api/404',
			},
		]
	},

	async headers() {
		return [
			{
				// matching all API routes
				source: '/api/:path*',
				headers: [
					{key: 'Access-Control-Allow-Credentials', value: 'true'},
					{key: 'Access-Control-Allow-Origin', value: '*'},
					{key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'},
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
				],
			},
		]
	},
}

export default nextConfig
