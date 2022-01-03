import config from 'utils/config'

const {RADIO4000_REPO_URL} = config

export default function handler(req, res) {
	res.status(404).json({
		message: 'Page or resource not found',
		documentation: `${RADIO4000_REPO_URL}`,
	})
}
