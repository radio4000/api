import {RADIO4000_REPO_URL} from 'utils/config'

export default function handler(req, res) {
	res.status(404).json({
		message: 'Page or resource not found',
		documentation: `${RADIO4000_REPO_URL}`,
	})
}
