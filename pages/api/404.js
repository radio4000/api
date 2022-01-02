import config from 'utils/config'

export default function handler(req, res) {
	res.status(404).json({
		message: 'Page or resource not found',
		documentation: `${config.repoURL}`,
	})
}
