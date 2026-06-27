const asyncHandler = require('../../../utils/asyncHandler')
const storyService = require('../services/story.service')

const getStory = asyncHandler(async (req, res) => {
  const story = await storyService.getStory()
  res.json({ success: true, data: story })
})

const updateStory = asyncHandler(async (req, res) => {
  const story = await storyService.updateStory(req.body)
  res.json({ success: true, data: story, message: 'Story updated successfully' })
})

module.exports = {
  getStory,
  updateStory,
}
