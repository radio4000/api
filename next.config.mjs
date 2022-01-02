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
	async rewrites() {
		return [
			{
				source: '/:path',
				destination: '/api/:path',
			},
		]
	},
}

export default nextConfig
