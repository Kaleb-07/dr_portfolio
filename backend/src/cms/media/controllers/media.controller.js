const asyncHandler = require('../../../utils/asyncHandler')
const mediaService = require('../services/media.service')

const getMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.getMedia()
  res.json({ success: true, data: media })
})

const updateMedia = asyncHandler(async (req, res) => {
  const media = await mediaService.updateMedia(req.body)
  res.json({ success: true, data: media, message: 'Media updated successfully' })
})

module.exports = {
  getMedia,
  updateMedia,
}
