const express = require('express')
const router = express.Router()
const prisma = require('../../prisma')
const { verifyToken } = require('../../middleware/auth.middleware')

const fallbackNavigation = [
  { id: 1, parent_id: null, label: 'Home', path: '/', target: '_self', sort_order: 0 },
  { id: 2, parent_id: null, label: 'About', path: '/about', target: '_self', sort_order: 1 },
  {
    id: 3,
    parent_id: null,
    label: 'Leadership',
    path: '/leadership',
    target: '_self',
    sort_order: 2,
  },
  {
    id: 4,
    parent_id: null,
    label: 'Ecosystem',
    path: '/ecosystem',
    target: '_self',
    sort_order: 3,
  },
  {
    id: 5,
    parent_id: null,
    label: 'Public Service',
    path: '/public-service',
    target: '_self',
    sort_order: 4,
  },
  {
    id: 6,
    parent_id: null,
    label: 'Education',
    path: '/education',
    target: '_self',
    sort_order: 5,
  },
  {
    id: 7,
    parent_id: null,
    label: 'Awards',
    path: '/awards-recognition',
    target: '_self',
    sort_order: 6,
  },
  {
    id: 8,
    parent_id: null,
    label: 'Foundation',
    path: '/foundation',
    target: '_self',
    sort_order: 7,
  },
  {
    id: 9,
    parent_id: null,
    label: 'Media',
    path: '/media-speaking',
    target: '_self',
    sort_order: 8,
  },
  { id: 10, parent_id: null, label: 'Gallery', path: '/gallery', target: '_self', sort_order: 9 },
  { id: 11, parent_id: null, label: 'Contact', path: '/contact', target: '_self', sort_order: 10 },
]

const heroRoutes = require('../hero/routes/hero.routes')
const storyRoutes = require('../story/routes/story.routes')
const ecosystemRoutes = require('../ecosystem/routes/ecosystem.routes')
const educationRoutes = require('../education/routes/education.routes')
const awardsRoutes = require('../awards/routes/awards.routes')
const contactRoutes = require('../contact/routes/contact.routes')
const mediaRoutes = require('../media/routes/media.routes')
const leadershipRoutes = require('../leadership/routes/leadership.routes')

router.use('/hero', heroRoutes)
router.use('/story', storyRoutes)
router.use('/ecosystem', ecosystemRoutes)
router.use('/education', educationRoutes)
router.use('/awards', awardsRoutes)
router.use('/contact', contactRoutes)
router.use('/media', mediaRoutes)
router.use('/leadership', leadershipRoutes)

function safeParseMetadata(value, fallback = {}) {
  if (!value) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch (error) {
    console.log('[cms.safeParseMetadata] invalid JSON:', error.message)
    return fallback
  }
}

router.get('/site-content', async (req, res) => {
  try {
    const [sections, navigation, identityItems, timelineEvents, contactSettings] =
      await Promise.all([
        prisma.cms_sections.findMany({
          where: { is_active: true },
          include: { blocks: { orderBy: { sort_order: 'asc' } } },
          orderBy: { sort_order: 'asc' },
        }),
        prisma.navigation_items.findMany({ orderBy: { sort_order: 'asc' } }),
        prisma.identity_items.findMany({ orderBy: { sort_order: 'asc' } }),
        prisma.timeline_events.findMany({ orderBy: { sort_order: 'asc' } }),
        prisma.contact_settings.findFirst(),
      ])

    const navMap = new Map()
    const rootItems = []

    navigation.forEach((item) => {
      navMap.set(item.id, { ...item, children: [] })
    })

    navigation.forEach((item) => {
      const navItem = navMap.get(item.id)
      if (item.parent_id && navMap.has(item.parent_id)) {
        navMap.get(item.parent_id).children.push(navItem)
      } else {
        rootItems.push(navItem)
      }
    })

    const sectionsMap = {}
    sections.forEach((s) => {
      sectionsMap[s.slug] = {
        ...s,
        metadata: safeParseMetadata(s.metadata, {}),
        blocks: s.blocks.map((block) => ({
          ...block,
          metadata: safeParseMetadata(block.metadata, {}),
        })),
      }
    })

    const sectionOrder = sections.map((s) => s.slug)

    res.json({
      sections: sectionsMap,
      sectionOrder,
      identityItems: identityItems || [],
      timelineEvents: timelineEvents || [],
      navigation: rootItems,
      contact: contactSettings,
    })
  } catch (error) {
    console.error('Error fetching site content:', error)
    res.json({
      sections: {},
      sectionOrder: [],
      identityItems: [],
      timelineEvents: [],
      navigation: fallbackNavigation,
      contact: null,
    })
  }
})

router.get('/sections', verifyToken, async (req, res) => {
  try {
    const sections = await prisma.cms_sections.findMany({
      orderBy: { sort_order: 'asc' },
      include: { blocks: { orderBy: { sort_order: 'asc' } } },
    })
    const parsed = sections.map((s) => ({
      ...s,
      metadata: safeParseMetadata(s.metadata, {}),
      blocks: s.blocks.map((block) => ({
        ...block,
        metadata: safeParseMetadata(block.metadata, {}),
      })),
    }))
    res.json(parsed)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/sections', verifyToken, async (req, res) => {
  try {
    const {
      slug,
      section_type,
      eyebrow,
      title,
      subtitle,
      description,
      image_url,
      image_alt,
      metadata,
    } = req.body

    const maxSort = await prisma.cms_sections.aggregate({ _max: { sort_order: true } })
    const sort_order = (maxSort._max.sort_order || 0) + 1

    const created = await prisma.cms_sections.create({
      data: {
        slug,
        section_type: section_type || 'generic',
        eyebrow: eyebrow || null,
        title: title || null,
        subtitle: subtitle || null,
        description: description || null,
        image_url: image_url || null,
        image_alt: image_alt || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        sort_order,
        is_active: true,
      },
    })

    res.status(201).json(created)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/sections/reorder', verifyToken, async (req, res) => {
  try {
    const { slugs } = req.body

    await prisma.$transaction(
      slugs.map((slug, index) =>
        prisma.cms_sections.update({
          where: { slug },
          data: { sort_order: index + 1 },
        }),
      ),
    )

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/sections/:slug', verifyToken, async (req, res) => {
  try {
    const { section = {}, blocks = [] } = req.body
    const storedSection = await prisma.$transaction(async (tx) => {
      const savedSection = await tx.cms_sections.upsert({
        where: { slug: req.params.slug },
        update: {
          eyebrow: section.eyebrow || null,
          title: section.title || null,
          subtitle: section.subtitle || null,
          description: section.description || null,
          image_url: section.image_url || null,
          image_alt: section.image_alt || null,
          metadata: section.metadata
            ? JSON.stringify(safeParseMetadata(section.metadata, {}))
            : null,
          is_active: section.is_active === 0 ? false : true,
        },
        create: {
          slug: req.params.slug,
          section_type: section.section_type || 'generic',
          eyebrow: section.eyebrow || null,
          title: section.title || null,
          subtitle: section.subtitle || null,
          description: section.description || null,
          image_url: section.image_url || null,
          image_alt: section.image_alt || null,
          metadata: section.metadata
            ? JSON.stringify(safeParseMetadata(section.metadata, {}))
            : null,
          is_active: section.is_active === 0 ? false : true,
        },
      })

      await tx.cms_section_blocks.deleteMany({
        where: { section_id: savedSection.id },
      })

      if (blocks.length > 0) {
        await tx.cms_section_blocks.createMany({
          data: blocks.map((block, index) => ({
            section_id: savedSection.id,
            block_type: block.block_type || 'content',
            eyebrow: block.eyebrow || null,
            title: block.title || null,
            body: block.body || null,
            image_url: block.image_url || null,
            image_alt: block.image_alt || null,
            metadata: block.metadata ? JSON.stringify(safeParseMetadata(block.metadata, {})) : null,
            sort_order: block.sort_order || index + 1,
            is_active: block.is_active === 0 ? false : true,
          })),
        })
      }

      return tx.cms_sections.findUnique({
        where: { slug: req.params.slug },
        include: {
          blocks: {
            orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
          },
        },
      })
    })

    res.json({ message: 'Section saved', data: storedSection })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/sections/:slug', verifyToken, async (req, res) => {
  try {
    await prisma.cms_sections.delete({
      where: { slug: req.params.slug },
    })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
