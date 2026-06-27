const asyncHandler = require('../../../utils/asyncHandler')
const heroService = require('../services/hero.service')

const getHero = asyncHandler(async (req, res) => {
  const hero = await heroService.getHero()
  res.json({ success: true, data: hero })
})

const updateHero = asyncHandler(async (req, res) => {
  const hero = await heroService.updateHero(req.body)
  res.json({ success: true, data: hero, message: 'Hero section updated successfully' })
})

module.exports = {
  getHero,
  updateHero,
}
