const asyncHandler = require('../../../utils/asyncHandler')
const awardsService = require('../services/awards.service')

const getAwards = asyncHandler(async (req, res) => {
  const awards = await awardsService.getAwards()
  res.json({ success: true, data: awards })
})

const updateAwards = asyncHandler(async (req, res) => {
  const awards = await awardsService.updateAwards(req.body)
  res.json({ success: true, data: awards, message: 'Awards updated successfully' })
})

module.exports = {
  getAwards,
  updateAwards,
}
