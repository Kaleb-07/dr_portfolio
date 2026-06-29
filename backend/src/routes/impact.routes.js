const express = require('express')
const router = express.Router()
const prisma = require('../prisma')

/**
 * GET impact section by slug
 * Returns eyebrow, title, and the parsed metadata
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const section = await prisma.cms_sections.findUnique({
      where: { slug },
    })

    if (!section) {
      return res.json({ eyebrow: '', title: '' }) // empty defaults
    }

    let data = {}
    if (section.metadata) {
      try {
        data = JSON.parse(section.metadata)
      } catch (err) {
        data = {}
      }
    }

    // Return eyebrow & title alongside the metadata
    res.json({
      eyebrow: section.eyebrow || '',
      title: section.title || '',
      ...data,
    })
  } catch (error) {
    console.log('GET IMPACT ERROR:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * PUT impact section by slug (create or update)
 * Accepts eyebrow, title, plus the rest of the payload
 */
router.put('/:slug', async (req, res) => {
  try {
    const { slug } = req.params
    const { eyebrow, title, ...payload } = req.body   // destructure eyebrow & title

    const result = await prisma.cms_sections.upsert({
      where: { slug },
      update: {
        eyebrow: eyebrow !== undefined ? eyebrow : undefined,
        title: title !== undefined ? title : undefined,
        metadata: JSON.stringify(payload),
      },
      create: {
        slug,
        section_type: 'impact',
        eyebrow: eyebrow || '',
        title: title || '',
        metadata: JSON.stringify(payload),
      },
    })

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