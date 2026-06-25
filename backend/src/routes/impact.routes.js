const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

/**
 * GET impact section by slug
 * Example: /api/impact/foundation
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    console.log('[impact.get] slug received:', slug)

    const section = await prisma.cms_sections.findUnique({
      where: { slug },
    })

    if (!section) {
      return res.json({})
    }

    // metadata is stored as JSON string (safe parse)
    let data = {}

    if (section.metadata) {
      try {
        data = JSON.parse(section.metadata)
      } catch (err) {
        console.log('Invalid JSON in metadata:', err.message)
        data = {}
      }
    }

    console.log('[impact.get] response data:', { slug, data })
    res.json(data)
  } catch (error) {
    console.log('GET IMPACT ERROR:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * PUT impact section by slug (create or update)
 * Example: /api/impact/foundation
 */
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const payload = req.body
    console.log('[impact.put] slug received:', slug)
    console.log('[impact.put] payload received:', payload)

    const result = await prisma.cms_sections.upsert({
      where: { slug },
      update: {
        metadata: JSON.stringify(payload),
      },
      create: {
        slug,
        section_type: 'impact',
        metadata: JSON.stringify(payload),
      },
    })

    console.log('[impact.put] prisma result:', result)
    res.json({
      success: true,
      message: 'Impact section saved successfully',
      data: result,
    })
  } catch (error) {
    console.log('PUT IMPACT ERROR:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
