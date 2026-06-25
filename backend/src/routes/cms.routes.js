const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const verifyToken = require('../middleware/auth.middleware')

const SECTION_SLUGS = [
  'vision_agenda',
  'about_values',
  'about_banner',
  'about_story',
  'identity_overview',
  'about_vision',
  'liyana_framework',
  'foundation_story',
  'recognition_awards',
  'leadership_philosophy',
]

const sectionSeeds = [
  {
    slug: 'vision_agenda',
    section_type: 'hero_agenda',
    eyebrow: 'The Visionary Agenda',
    title:
      'One doctor\'s blueprint for a <br /><em class="text-teal-mid italic">self-sufficient healthcare Africa</em>',
    subtitle: 'DR. LIYANA - PROFILE',
    description: '',
    image_url: '/image.png',
    image_alt: 'Dr. Girma Ababi',
    metadata: {
      cta: [],
      metrics: [
        {
          value: '20+',
          label: 'Years as Medical Doctor',
          description: 'Over two decades of clinical practice and medical expertise.',
        },
        {
          value: '15+',
          label: 'Years as Anatomical Pathologist',
          description: 'Specialist in anatomical pathology with advanced diagnostic experience.',
        },
        {
          value: '14+',
          label: 'Years Healthcare Investment & Leadership',
          description: 'Building and leading healthcare enterprises across the value chain.',
        },
      ],
    },
    blocks: [
      { block_type: 'identity_teaser', title: 'Physician', eyebrow: 'Identity I', sort_order: 1 },
      {
        block_type: 'identity_teaser',
        title: 'Entrepreneur',
        eyebrow: 'Identity II',
        sort_order: 2,
      },
      {
        block_type: 'identity_teaser',
        title: 'Nation Builder',
        eyebrow: 'Identity III',
        sort_order: 3,
      },
    ],
  },
  {
    slug: 'identity_overview',
    section_type: 'ordered_collection',
    eyebrow: 'Overview',
    title: "Dr. Girma Ababi's professional dimensions",
    description:
      'Explore the journey and background of a clinician who stepped beyond practice to build clinical chains, educational systems, and national frameworks.',
    metadata: {
      cta: [
        { label: 'Explore Journey', path: '/about', variant: 'primary' },
        { label: 'Get in Touch', path: '/contact', variant: 'ghost' },
      ],
    },
    blocks: [],
  },
  {
    slug: 'about_story',
    section_type: 'story',
    eyebrow: 'The Story',
    title: 'A life in <em class="text-teal-mid not-italic">service</em>',
    description: 'A life in service and a portrait.',
    image_url: '/image.png',
    image_alt: 'Dr. Girma Ababi Portrait',
    metadata: {},
    blocks: [
      {
        block_type: 'chapter',
        title: 'Early Life & Training',
        body: "Born in Tulu Milky and educated at Gebreguracha High School, I earned my MD from the University of Gondar and Addis Ababa University. I became one of Ethiopia's leading Anatomical Pathologists after completing my specialty at AAU, serving as Chief Resident for two years.",
        sort_order: 1,
      },
      {
        block_type: 'chapter',
        title: 'Clinical & Academic Career',
        body: 'I built my career as a clinical specialist and academic, serving as Assistant Professor at YLC Health Sciences and practicing anatomical pathology.',
        sort_order: 2,
      },
      {
        block_type: 'chapter',
        title: 'Entrepreneurship & Leadership',
        body: 'Around 2010, I stepped into healthcare entrepreneurship to build an integrated system spanning hospitals, pharma manufacturing, training, research, and financing. In 2019 I attended Stanford GSB Seed Program and in 2023 I was appointed Vice President of the Ethiopian Healthcare Federation.',
        sort_order: 3,
      },
    ],
  },
  {
    slug: 'about_banner',
    section_type: 'banner',
    eyebrow: null,
    title: 'The Story',
    subtitle: null,
    description: 'A life dedicated to healthcare leadership and transformation.',
    image_url: null,
    image_alt: null,
    metadata: {},
    blocks: [],
  },
  {
    slug: 'about_vision',
    section_type: 'quote',
    eyebrow: 'Vision',
    title: 'A healthier Africa',
    description:
      'An integrated, self-sustaining healthcare ecosystem in Ethiopia that delivers quality care to millions, empowers thousands of professionals, and serves as a model for health system transformation across Africa.',
    metadata: {},
    blocks: [],
  },
  {
    slug: 'about_values',
    section_type: 'ordered_collection',
    eyebrow: 'Values',
    title: 'Principles that guide every decision',
    description: '',
    metadata: {},
    blocks: [
      {
        block_type: 'value',
        title: 'Institution Building',
        body: 'True impact comes from building institutions that outlast any individual. I am committed to creating sustainable healthcare organizations that serve generations.',
        sort_order: 1,
        metadata: { icon: 'hospital' },
      },
      {
        block_type: 'value',
        title: 'Professional Empowerment',
        body: 'Healthcare transformation happens through empowered professionals. I invest in training, mentorship, and creating opportunities for the next generation of healthcare leaders.',
        sort_order: 2,
        metadata: { icon: 'users' },
      },
      {
        block_type: 'value',
        title: 'Integrated Systems Thinking',
        body: 'Healthcare cannot be transformed piece by piece. An integrated approach spanning hospitals, education, manufacturing, research, digital health, and financing is the only path to lasting change.',
        sort_order: 3,
        metadata: { icon: 'grid' },
      },
      {
        block_type: 'value',
        title: 'Service to Nation',
        body: 'From clinical practice to policy leadership, my work has always been driven by a deep commitment to serving Ethiopia and its people.',
        sort_order: 4,
        metadata: { icon: 'heart' },
      },
    ],
  },
  {
    slug: 'liyana_framework',
    section_type: 'framework_grid',
    eyebrow: 'The Liyana Healthcare Framework',
    title:
      'A vertically integrated ecosystem <em class="not-italic text-teal-mid">for sovereignty and scale.</em>',
    description: '',
    metadata: { cta: [{ label: 'Explore Ecosystem', path: '/ecosystem', variant: 'ghost' }] },
    blocks: [
      {
        block_type: 'framework_node',
        title: 'Healthcare Delivery',
        body: 'The Yanet Chain of Hospitals provides tertiary diagnostic services, therapeutic care centers, and outpatient clinics across Ethiopia, forming the clinical backbone of Liyana Healthcare.',
        metadata: { icon: 'hospital', category: 'hospital' },
        sort_order: 1,
      },
      {
        block_type: 'framework_node',
        title: 'Education & Training',
        body: 'YLC Health Sciences College delivers medical professional training, research programs, and academic pathways for the next generation of healthcare professionals.',
        metadata: { icon: 'graduation-cap', category: 'education' },
        sort_order: 2,
      },
      {
        block_type: 'framework_node',
        title: 'Manufacturing',
        body: 'Pharmaceutical production and local drug manufacturing facilities ensure reliable supply chains, retail distribution, and affordable access to essential medicines.',
        metadata: { icon: 'flask', category: 'manufacturing' },
        sort_order: 3,
      },
      {
        block_type: 'framework_node',
        title: 'Research',
        body: 'Medical research programs, anatomical pathology research, academic publications, and innovation think-tanks drive evidence-based advancement in healthcare.',
        metadata: { icon: 'microscope', category: 'research' },
        sort_order: 4,
      },
      {
        block_type: 'framework_node',
        title: 'Digital Health',
        body: 'Healthcare technology platforms, digital health innovation, patient data systems, and telemedicine solutions bridge the gap between patients and providers.',
        metadata: { icon: 'mobile', category: 'digital-health' },
        sort_order: 5,
      },
      {
        block_type: 'framework_node',
        title: 'Healthcare Financing',
        body: 'Health insurance products, life insurance offerings, and innovative healthcare financing models make quality care accessible and affordable.',
        metadata: { icon: 'wallet', category: 'insurance' },
        sort_order: 6,
      },
    ],
  },
  {
    slug: 'foundation_story',
    section_type: 'foundation_preview',
    eyebrow: 'Foundation',
    title: 'The <em class="text-teal-mid not-italic">LUCS Foundation</em>',
    description:
      'Founded and patroned by Dr. Girma Ababi, the LUCS Foundation is dedicated to transforming lives through community health outreach, education access, healthcare access in underserved regions, professional empowerment & mentorship, and future healthcare infrastructure development.',
    metadata: {
      cta: [{ label: 'Explore Foundation', path: '/foundation', variant: 'ghost' }],
      stats: [
        { value: '5+', label: 'Community Impact Pillars' },
        { value: '4', label: 'Board Chairmanships' },
        { value: '1', label: 'CSO Board Chairmanship' },
        { value: '1000+', label: 'Lives Impacted' },
      ],
    },
    blocks: [
      {
        block_type: 'pillar',
        title: 'Community Health',
        metadata: { icon: 'heart-pulse' },
        sort_order: 1,
      },
      {
        block_type: 'pillar',
        title: 'Education Access',
        metadata: { icon: 'graduation-cap' },
        sort_order: 2,
      },
      {
        block_type: 'pillar',
        title: 'Healthcare Infrastructure',
        metadata: { icon: 'hospital' },
        sort_order: 3,
      },
      {
        block_type: 'pillar',
        title: 'Professional Mentorship',
        metadata: { icon: 'handshake' },
        sort_order: 4,
      },
    ],
  },
  {
    slug: 'recognition_awards',
    section_type: 'awards_carousel',
    eyebrow: 'Recognition',
    title: 'Awards &amp; <em class="text-teal not-italic">honours</em>',
    description: 'Distinctions that reflect a career of transformative leadership in healthcare.',
    metadata: { cta: [{ label: 'View All', path: '/awards-recognition', variant: 'ghost' }] },
    blocks: [
      {
        block_type: 'award',
        title: 'Special Alumni Award for Extraordinary Achievement',
        body: 'Recognized by the University of Gondar with the Special Alumni Award for extraordinary achievement and distinguished contributions to healthcare and national development.',
        image_url: '/image.png',
        image_alt: 'Special Alumni Award for Extraordinary Achievement',
        metadata: { organization: 'University of Gondar', year: 2024, category: 'alumni' },
        sort_order: 1,
      },
      {
        block_type: 'award',
        title: 'Vice Presidential Appointment – National Leadership',
        body: 'Appointed Vice President of the Ethiopian Healthcare Federation, recognizing national leadership in healthcare policy, strategy, and sector development.',
        image_url: '/image.png',
        image_alt: 'Vice Presidential Appointment – National Leadership',
        metadata: {
          organization: 'Ethiopian Healthcare Federation',
          year: 2023,
          category: 'leadership',
        },
        sort_order: 2,
      },
      {
        block_type: 'award',
        title: 'Seed Program Graduate – Emerging Economies Leadership',
        body: 'Graduated from the Stanford GSB Seed Transformation Program, recognized for leadership in building transformative enterprises in emerging economies.',
        image_url: '/image.png',
        image_alt: 'Seed Program Graduate – Emerging Economies Leadership',
        metadata: {
          organization: 'Stanford University Graduate School of Business',
          year: 2021,
          category: 'industry',
        },
        sort_order: 3,
      },
      {
        block_type: 'award',
        title: 'Rotarian – Community Leadership Member',
        body: 'Honored as a Rotarian and Community Leadership Member for dedicated service to community health and development initiatives.',
        image_url: '/image.png',
        image_alt: 'Rotarian – Community Leadership Member',
        metadata: { organization: 'Rotary International', year: 2023, category: 'professional' },
        sort_order: 4,
      },
    ],
  },
  {
    slug: 'leadership_philosophy',
    section_type: 'quote',
    eyebrow: 'Leadership Philosophy',
    title: '',
    description:
      '"Building institutions, empowering professionals, and transforming healthcare for future generations — that is the only legacy worth pursuing."',
    subtitle: '— Dr. Girma Ababi, Founder & CEO, Liyana Healthcare',
    metadata: {},
    blocks: [],
  },
]

const identitySeeds = [
  {
    label: '01',
    title: 'Medical Doctor & Anatomical Pathologist',
    description: '20+ years clinical · 15+ years specialty · Asst. Professor, YLC Health Sciences',
    sort_order: 1,
  },
  {
    label: '02',
    title: 'Founder & CEO, Liyana Healthcare',
    description:
      'Yanet Chain of Hospitals · Health Sciences College · Pharmaceuticals · 1,000+ employees',
    sort_order: 2,
  },
  {
    label: '03',
    title: 'Vice President, Ethiopian Healthcare Federation',
    description:
      'National policy, strategy & regulatory advisory roles · Ministry of Health councils',
    sort_order: 3,
  },
  {
    label: '04',
    title: 'Board Chairman · Stanford GSB Alumni · Philanthropist',
    description:
      '4 boards · LUCS Foundation Founder & Patron · University of Gondar Special Alumni Awardee',
    sort_order: 4,
  },
]

const timelineSeeds = [
  {
    slug: 'md-degree',
    year: '1992',
    title: 'MD, Medicine',
    subtitle: 'University of Gondar & AAU/HSC',
    description:
      'Earned his medical degree from the University of Gondar and Addis Ababa University Health Sciences Center.',
    category: 'education',
    sort_order: 1,
  },
  {
    slug: 'specialty-pathology',
    year: '2002',
    title: 'Specialty Diploma in Anatomical Pathology',
    subtitle: 'Addis Ababa University',
    description:
      'Completed specialty training in anatomical pathology at AAU, serving as Chief Resident for two years.',
    category: 'education',
    sort_order: 2,
  },
  {
    slug: 'assistant-professor',
    year: '2004',
    title: 'MD in Anatomical Pathology – Practice & Teaching',
    subtitle: 'Asst. Professor at YLC Health Sciences',
    description:
      'Practiced as a clinical specialist in anatomical pathology and served as Assistant Professor at YLC Health Sciences.',
    category: 'career',
    sort_order: 3,
  },
  {
    slug: 'entrepreneurship-begins',
    year: '2010',
    title: 'Healthcare Entrepreneurship Begins',
    subtitle: 'Liyana Healthcare Founded',
    description:
      'Founded Liyana Healthcare, beginning the journey to build an integrated healthcare system spanning hospitals, pharma, training, research, and financing.',
    category: 'milestone',
    sort_order: 4,
  },
  {
    slug: 'stanford-seed',
    year: '2019',
    title: 'Stanford University Seed Transformation Program',
    subtitle: 'Stanford Graduate School of Business',
    description:
      'Joined the prestigious Seed Transformation Program at Stanford GSB to accelerate organizational leadership and enterprise growth.',
    category: 'education',
    sort_order: 5,
  },
  {
    slug: 'vice-president-ehf',
    year: '2023',
    title: 'Vice President',
    subtitle: 'Ethiopian Healthcare Federation',
    description:
      'Appointed Vice President of the Ethiopian Healthcare Federation, shaping national healthcare policy and strategy.',
    category: 'career',
    sort_order: 6,
  },
  {
    slug: 'current-leadership',
    year: '2025',
    title: 'CEO, Investor, Policy Leader & Philanthropist',
    subtitle: 'Leading Liyana Healthcare Ecosystem',
    description:
      'Leading a multi-sector healthcare ecosystem as CEO, investor, policy leader, and philanthropist.',
    category: 'milestone',
    sort_order: 7,
  },
]

const navigationSeeds = [
  { label: 'Story', path: '/', sort_order: 1, children: [] },
  {
    label: 'Profile',
    sort_order: 2,
    children: [
      { label: 'Journey', path: '/about', sort_order: 1 },
      { label: 'Education', path: '/education', sort_order: 2 },
      { label: 'Gallery', path: '/gallery', sort_order: 3 },
    ],
  },
  { label: 'Ecosystem', path: '/ecosystem', sort_order: 3, children: [] },
  {
    label: 'Impact',
    sort_order: 4,
    children: [
      { label: 'Public Service', path: '/public-service', sort_order: 1 },
      { label: 'Leadership', path: '/leadership', sort_order: 2 },
      { label: 'Foundation', path: '/foundation', sort_order: 3 },
    ],
  },
  {
    label: 'Achievements',
    sort_order: 5,
    children: [
      { label: 'Awards & Recognition', path: '/awards-recognition', sort_order: 1 },
      { label: 'Media & Speaking', path: '/media-speaking', sort_order: 2 },
    ],
  },
  { label: 'Contact', path: '/contact', sort_order: 6, children: [] },
]

async function initCmsSchema() {
  await seedCms()
}

async function seedCms() {
  for (const section of sectionSeeds) {
    const existingSection = await prisma.cms_sections.findUnique({ where: { slug: section.slug } })
    if (!existingSection) {
      const created = await prisma.cms_sections.create({
        data: {
          slug: section.slug,
          section_type: section.section_type,
          eyebrow: section.eyebrow || null,
          title: section.title || null,
          subtitle: section.subtitle || null,
          description: section.description || null,
          image_url: section.image_url || null,
          image_alt: section.image_alt || null,
          metadata: section.metadata || {},
          sort_order: sectionSeeds.indexOf(section) + 1,
        },
      })

      if (section.blocks && section.blocks.length > 0) {
        await prisma.cms_section_blocks.createMany({
          data: section.blocks.map((block) => ({
            section_id: created.id,
            block_type: block.block_type || 'content',
            eyebrow: block.eyebrow || null,
            title: block.title || null,
            body: block.body || null,
            image_url: block.image_url || null,
            image_alt: block.image_alt || null,
            metadata: block.metadata || {},
            sort_order: block.sort_order || 0,
          })),
        })
      }
    }
  }

  const identityCount = await prisma.identity_items.count()
  if (identityCount === 0) {
    await prisma.identity_items.createMany({
      data: identitySeeds.map((item) => ({
        label: item.label,
        title: item.title,
        description: item.description,
        icon: item.icon || null,
        image_url: item.image_url || null,
        sort_order: item.sort_order,
      })),
    })
  }

  const timelineCount = await prisma.timeline_events.count()
  if (timelineCount === 0) {
    await prisma.timeline_events.createMany({
      data: timelineSeeds.map((event) => ({
        slug: event.slug,
        year: event.year,
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        category: event.category,
        icon: event.icon || null,
        sort_order: event.sort_order,
      })),
    })
  }

  const navCount = await prisma.navigation_items.count()
  if (navCount === 0) {
    for (const item of navigationSeeds) {
      const parent = await prisma.navigation_items.create({
        data: {
          parent_id: null,
          label: item.label,
          path: item.path || null,
          sort_order: item.sort_order,
          metadata: {},
        },
      })

      if (item.children && item.children.length > 0) {
        await prisma.navigation_items.createMany({
          data: item.children.map((child) => ({
            parent_id: parent.id,
            label: child.label,
            path: child.path || null,
            sort_order: child.sort_order,
            metadata: {},
          })),
        })
      }
    }
  }
}

async function getSections(slugs = SECTION_SLUGS) {
  const sections = await prisma.cms_sections.findMany({
    where: { slug: { in: slugs } },
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  })

  const sectionIds = sections.map((s) => s.id)
  const blocks = await prisma.cms_section_blocks.findMany({
    where: { section_id: { in: sectionIds } },
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  })

  return sections.reduce((acc, section) => {
    acc[section.slug] = {
      ...section,
      blocks: blocks.filter((block) => block.section_id === section.id),
    }
    return acc
  }, {})
}

async function getIdentityItems(includeInactive = false) {
  return prisma.identity_items.findMany({
    where: includeInactive ? {} : { is_active: true },
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  })
}

async function getTimelineEvents(includeInactive = false) {
  return prisma.timeline_events.findMany({
    where: includeInactive ? {} : { is_active: true },
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  })
}

function buildNavigationTree(rows, parentId = null) {
  return rows
    .filter((item) => item.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map((item) => ({
      ...item,
      children: buildNavigationTree(rows, item.id),
    }))
}

async function getNavigation(includeInactive = false) {
  const rows = await prisma.navigation_items.findMany({
    where: includeInactive ? {} : { is_active: true },
    orderBy: [{ parent_id: 'asc' }, { sort_order: 'asc' }, { id: 'asc' }],
  })
  return buildNavigationTree(rows)
}

router.get('/site-content', async (req, res) => {
  try {
    const [sections, identityItems, timelineEvents, navigation] = await Promise.all([
      getSections(),
      getIdentityItems(),
      getTimelineEvents(),
      getNavigation(),
    ])

    res.json({ sections, identityItems, timelineEvents, navigation })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/sections/:slug', async (req, res) => {
  try {
    const sections = await getSections([req.params.slug])
    if (!sections[req.params.slug]) return res.status(404).json({ message: 'Section not found' })
    res.json(sections[req.params.slug])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/sections/:slug', verifyToken, async (req, res) => {
  try {
    const { section = {}, blocks = [] } = req.body

    await prisma.$transaction(async (tx) => {
      await tx.cms_sections.updateMany({
        where: { slug: req.params.slug },
        data: {
          eyebrow: section.eyebrow || null,
          title: section.title || null,
          subtitle: section.subtitle || null,
          description: section.description || null,
          image_url: section.image_url || null,
          image_alt: section.image_alt || null,
          metadata: section.metadata || {},
          is_active: section.is_active === 0 ? false : true,
        },
      })

      const storedSection = await tx.cms_sections.findUnique({
        where: { slug: req.params.slug },
        select: { id: true },
      })

      if (!storedSection) {
        throw new Error('Section not found')
      }

      await tx.cms_section_blocks.deleteMany({
        where: { section_id: storedSection.id },
      })

      if (blocks.length > 0) {
        await tx.cms_section_blocks.createMany({
          data: blocks.map((block, index) => ({
            section_id: storedSection.id,
            block_type: block.block_type || 'content',
            eyebrow: block.eyebrow || null,
            title: block.title || null,
            body: block.body || null,
            image_url: block.image_url || null,
            image_alt: block.image_alt || null,
            metadata: block.metadata || {},
            sort_order: block.sort_order || index + 1,
            is_active: block.is_active === 0 ? false : true,
          })),
        })
      }
    })

    res.json({ message: 'Section saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/identity-items', async (req, res) => {
  try {
    res.json(await getIdentityItems(req.query.all === '1'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/identity-items', verifyToken, async (req, res) => {
  try {
    const { label, title, description, icon, image_url, sort_order, is_active } = req.body
    const created = await prisma.identity_items.create({
      data: {
        label: label || null,
        title,
        description: description || null,
        icon: icon || null,
        image_url: image_url || null,
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
      },
    })
    res.status(201).json({ id: created.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/identity-items/:id', verifyToken, async (req, res) => {
  try {
    const { label, title, description, icon, image_url, sort_order, is_active } = req.body
    await prisma.identity_items.update({
      where: { id: Number(req.params.id) },
      data: {
        label: label || null,
        title,
        description: description || null,
        icon: icon || null,
        image_url: image_url || null,
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
      },
    })
    res.json({ message: 'Identity item saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/identity-items/:id', verifyToken, async (req, res) => {
  try {
    await prisma.identity_items.delete({
      where: { id: Number(req.params.id) },
    })
    res.json({ message: 'Identity item deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/timeline-events', async (req, res) => {
  try {
    res.json(await getTimelineEvents(req.query.all === '1'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/timeline-events', verifyToken, async (req, res) => {
  try {
    const { slug, year, title, subtitle, description, category, icon, sort_order, is_active } =
      req.body
    const created = await prisma.timeline_events.create({
      data: {
        slug: slug || null,
        year: year || null,
        title,
        subtitle: subtitle || null,
        description: description || null,
        category: category || 'milestone',
        icon: icon || null,
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
      },
    })
    res.status(201).json({ id: created.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/timeline-events/:id', verifyToken, async (req, res) => {
  try {
    const { slug, year, title, subtitle, description, category, icon, sort_order, is_active } =
      req.body
    await prisma.timeline_events.update({
      where: { id: Number(req.params.id) },
      data: {
        slug: slug || null,
        year: year || null,
        title,
        subtitle: subtitle || null,
        description: description || null,
        category: category || 'milestone',
        icon: icon || null,
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
      },
    })
    res.json({ message: 'Timeline event saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/timeline-events/:id', verifyToken, async (req, res) => {
  try {
    await prisma.timeline_events.delete({
      where: { id: Number(req.params.id) },
    })
    res.json({ message: 'Timeline event deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/navigation-items', async (req, res) => {
  try {
    res.json(await getNavigation(req.query.all === '1'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/navigation-items', verifyToken, async (req, res) => {
  try {
    const { parent_id, label, path, target, sort_order, is_active, metadata } = req.body
    const created = await prisma.navigation_items.create({
      data: {
        parent_id: parent_id || null,
        label,
        path: path || null,
        target: target || '_self',
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
        metadata: metadata || {},
      },
    })
    res.status(201).json({ id: created.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/navigation-items/:id', verifyToken, async (req, res) => {
  try {
    const { parent_id, label, path, target, sort_order, is_active, metadata } = req.body
    await prisma.navigation_items.update({
      where: { id: Number(req.params.id) },
      data: {
        parent_id: parent_id || null,
        label,
        path: path || null,
        target: target || '_self',
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
        metadata: metadata || {},
      },
    })
    res.json({ message: 'Navigation item saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/navigation-items/:id', verifyToken, async (req, res) => {
  try {
    await prisma.navigation_items.delete({
      where: { id: Number(req.params.id) },
    })
    res.json({ message: 'Navigation item deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.initCmsSchema = initCmsSchema

module.exports = router
