const noEndpoint = require('../_utils/no-endpoint')
const {createBackup} = require('radio4000-sdk')

module.exports = (req, res) => {
    const slug = req.query.slug

    if (!slug) return noEndpoint(res)

    createBackup(slug)
	.then(backup => res.status(200).send(backup))
}
