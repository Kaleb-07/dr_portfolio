const asyncHandler = require('../../../utils/asyncHandler')
const leadershipService = require('../services/leadership.service')

const getLeadership = asyncHandler(async (req, res) => {
  const leadership = await leadershipService.getLeadership()
  res.json({ success: true, data: leadership })
})

const updateLeadership = asyncHandler(async (req, res) => {
  const leadership = await leadershipService.updateLeadership(req.body)
  res.json({ success: true, data: leadership, message: 'Leadership updated successfully' })
})

module.exports = {
  getLeadership,
  updateLeadership,
}
