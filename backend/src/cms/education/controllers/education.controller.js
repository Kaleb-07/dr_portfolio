const asyncHandler = require('../../../utils/asyncHandler')
const educationService = require('../services/education.service')

const getEducation = asyncHandler(async (req, res) => {
  const education = await educationService.getEducation()
  res.json({ success: true, data: education })
})

const updateEducation = asyncHandler(async (req, res) => {
  const education = await educationService.updateEducation(req.body)
  res.json({ success: true, data: education, message: 'Education updated successfully' })
})

module.exports = {
  getEducation,
  updateEducation,
}
