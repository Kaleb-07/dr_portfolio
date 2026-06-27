const express = require('express')
const router = express.Router()
const prisma = require('../../prisma')

const fallbackNavigation = [
  { id: 1, parent_id: null, label: 'Home', path: '/', target: '_self', sort_order: 0 },
  { id: 2, parent_id: null, label: 'About', path: '/about', target: '_self', sort_order: 1 },
  { id: 3, parent_id: null, label: 'Leadership', path: '/leadership', target: '_self', sort_order: 2 },
  { id: 4, parent_id: null, label: 'Ecosystem', path: '/ecosystem', target: '_self', sort_order: 3 },
  { id: 5, parent_id: null, label: 'Public Service', path: '/public-service', target: '_self', sort_order: 4 },
  { id: 6, parent_id: null, label: 'Education', path: '/education', target: '_self', sort_order: 5 },
  { id: 7, parent_id: null, label: 'Awards', path: '/awards-recognition', target: '_self', sort_order: 6 },
  { id: 8, parent_id: null, label: 'Foundation', path: '/foundation', target: '_self', sort_order: 7 },
  { id: 9, parent_id: null, label: 'Media', path: '/media-speaking', target: '_self', sort_order: 8 },
  { id: 10, parent_id: null, label: 'Gallery', path: '/gallery', target: '_self', sort_order: 9 },
  { id: 11, parent_id: null, label: 'Contact', path: '/contact', target: '_self', sort_order: 10 },
]

// Import CMS domain routes
const heroRoutes = require('../hero/routes/hero.routes')
const storyRoutes = require('../story/routes/story.routes')
const ecosystemRoutes = require('../ecosystem/routes/ecosystem.routes')
const educationRoutes = require('../education/routes/education.routes')
const awardsRoutes = require('../awards/routes/awards.routes')
const contactRoutes = require('../contact/routes/contact.routes')
const mediaRoutes = require('../media/routes/media.routes')
const leadershipRoutes = require('../leadership/routes/leadership.routes')

// Mount CMS routes
router.use('/hero', heroRoutes)
router.use('/story', storyRoutes)
router.use('/ecosystem', ecosystemRoutes)
router.use('/education', educationRoutes)
router.use('/awards', awardsRoutes)
router.use('/contact', contactRoutes)
router.use('/media', mediaRoutes)
router.use('/leadership', leadershipRoutes)

// Site content endpoint - aggregates all CMS data
router.get('/site-content', async (req, res) => {
  try {
    const [
      heroSection,
      storySection,
      ecosystemSection,
      educationSection,
      awardsSection,
      contactSettings,
      mediaSection,
      leadershipSection,
      navigation,
      identityItems,
      timelineEvents,
    ] = await Promise.all([
      prisma.cms_sections.findFirst({
        where: { slug: 'hero_section' },
        include: { blocks: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.cms_sections.findFirst({
        where: { slug: 'story_narrative' },
        include: { blocks: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.cms_sections.findFirst({
        where: { slug: 'liyana_framework' },
        include: { blocks: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.cms_sections.findFirst({
        where: { slug: 'about_education' },
        include: { blocks: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.cms_sections.findFirst({
        where: { slug: 'recognition_awards' },
        include: { blocks: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.contact_settings.findFirst(),
      prisma.cms_sections.findFirst({
        where: { slug: 'media_gallery' },
        include: { blocks: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.cms_sections.findFirst({
        where: { slug: 'impact_collection' },
        include: { blocks: { orderBy: { sort_order: 'asc' } } },
      }),
      prisma.navigation_items.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.identity_items.findMany({ orderBy: { sort_order: 'asc' } }),
      prisma.timeline_events.findMany({ orderBy: { sort_order: 'asc' } }),
    ])

    // Transform navigation into tree structure
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

    const sections = {
      hero_section: heroSection,
      story_narrative: storySection,
      liyana_framework: ecosystemSection,
      about_education: educationSection,
      recognition_awards: awardsSection,
      media_gallery: mediaSection,
      impact_collection: leadershipSection,
    }

    res.json({
      sections,
      identityItems: identityItems || [],
      timelineEvents: timelineEvents || [],
      navigation: rootItems,
      contact: contactSettings,
    })
  } catch (error) {
    console.error('Error fetching site content:', error)
    res.json({
      sections: {},
      identityItems: [],
      timelineEvents: [],
      navigation: fallbackNavigation,
      contact: null,
    })
  }
})

module.exports = router
