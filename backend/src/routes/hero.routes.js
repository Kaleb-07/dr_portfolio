const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const verifyToken = require('../middleware/auth.middleware')

router.get('/', async (req, res) => {
  try {
    const hero = await prisma.hero_section.findFirst()

    if (!hero) {
      return res.status(404).json({ message: 'Hero not found' })
    }

    res.json(hero)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/', verifyToken, async (req, res) => {
  try {
    const {
      name,
      title,
      subtitle,
      description,
      cta_1_label,
      cta_1_path,
      cta_2_label,
      cta_2_path,
      backgroundImage,
    } = req.body

    await prisma.hero_section.upsert({
      where: { id: 1 },
      update: {
        name,
        title,
        subtitle,
        description,
        cta_1_label,
        cta_1_path,
        cta_2_label,
        cta_2_path,
        backgroundImage,
      },
      create: {
        id: 1,
        name,
        title,
        subtitle,
        description,
        cta_1_label,
        cta_1_path,
        cta_2_label,
        cta_2_path,
        backgroundImage,
      },
    })

    res.json({ message: 'Hero updated successfully 🚀' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
