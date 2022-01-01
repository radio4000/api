const nextConfig = {
	reactStrictMode: true,
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
