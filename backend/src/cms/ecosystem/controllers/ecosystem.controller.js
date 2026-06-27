const asyncHandler = require('../../../utils/asyncHandler')
const ecosystemService = require('../services/ecosystem.service')

const getEcosystem = asyncHandler(async (req, res) => {
  const ecosystem = await ecosystemService.getEcosystem()
  res.json({ success: true, data: ecosystem })
})

const updateEcosystem = asyncHandler(async (req, res) => {
  const ecosystem = await ecosystemService.updateEcosystem(req.body)
  res.json({ success: true, data: ecosystem, message: 'Ecosystem updated successfully' })
})

module.exports = {
  getEcosystem,
  updateEcosystem,
}
