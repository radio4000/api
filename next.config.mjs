const nextConfig = {
	// https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
	reactStrictMode: true,

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
				destination: '/api/404'
			}
		]
	},
}

export default nextConfig
