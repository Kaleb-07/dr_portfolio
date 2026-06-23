const express = require('express')
const router = express.Router()
const db = require('../db/db')
const verifyToken = require('../middleware/auth.middleware')

const SECTION_SLUGS = [
  'vision_agenda',
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
    title: "One doctor's blueprint for a <br /><em class=\"text-teal-mid italic\">self-sufficient healthcare Africa</em>",
    subtitle: 'DR. LIYANA - PROFILE',
    description: '',
    image_url: '/image.png',
    image_alt: 'Dr. Girma Ababi',
    metadata: {
      cta: [],
      metrics: [
        { value: '20+', label: 'Years as Medical Doctor', description: 'Over two decades of clinical practice and medical expertise.' },
        { value: '15+', label: 'Years as Anatomical Pathologist', description: 'Specialist in anatomical pathology with advanced diagnostic experience.' },
        { value: '14+', label: 'Years Healthcare Investment & Leadership', description: 'Building and leading healthcare enterprises across the value chain.' },
      ],
    },
    blocks: [
      { block_type: 'identity_teaser', title: 'Physician', eyebrow: 'Identity I', sort_order: 1 },
      { block_type: 'identity_teaser', title: 'Entrepreneur', eyebrow: 'Identity II', sort_order: 2 },
      { block_type: 'identity_teaser', title: 'Nation Builder', eyebrow: 'Identity III', sort_order: 3 },
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
    slug: 'liyana_framework',
    section_type: 'framework_grid',
    eyebrow: 'The Liyana Healthcare Framework',
    title: 'A vertically integrated ecosystem <em class="not-italic text-teal-mid">for sovereignty and scale.</em>',
    description: '',
    metadata: { cta: [{ label: 'Explore Ecosystem', path: '/ecosystem', variant: 'ghost' }] },
    blocks: [
      { block_type: 'framework_node', title: 'Healthcare Delivery', body: 'The Yanet Chain of Hospitals provides tertiary diagnostic services, therapeutic care centers, and outpatient clinics across Ethiopia, forming the clinical backbone of Liyana Healthcare.', metadata: { icon: 'hospital', category: 'hospital' }, sort_order: 1 },
      { block_type: 'framework_node', title: 'Education & Training', body: 'YLC Health Sciences College delivers medical professional training, research programs, and academic pathways for the next generation of healthcare professionals.', metadata: { icon: 'graduation-cap', category: 'education' }, sort_order: 2 },
      { block_type: 'framework_node', title: 'Manufacturing', body: 'Pharmaceutical production and local drug manufacturing facilities ensure reliable supply chains, retail distribution, and affordable access to essential medicines.', metadata: { icon: 'flask', category: 'manufacturing' }, sort_order: 3 },
      { block_type: 'framework_node', title: 'Research', body: 'Medical research programs, anatomical pathology research, academic publications, and innovation think-tanks drive evidence-based advancement in healthcare.', metadata: { icon: 'microscope', category: 'research' }, sort_order: 4 },
      { block_type: 'framework_node', title: 'Digital Health', body: 'Healthcare technology platforms, digital health innovation, patient data systems, and telemedicine solutions bridge the gap between patients and providers.', metadata: { icon: 'mobile', category: 'digital-health' }, sort_order: 5 },
      { block_type: 'framework_node', title: 'Healthcare Financing', body: 'Health insurance products, life insurance offerings, and innovative healthcare financing models make quality care accessible and affordable.', metadata: { icon: 'wallet', category: 'insurance' }, sort_order: 6 },
    ],
  },
  {
    slug: 'foundation_story',
    section_type: 'foundation_preview',
    eyebrow: 'Foundation',
    title: 'The <em class="text-teal-mid not-italic">LUCS Foundation</em>',
    description: 'Founded and patroned by Dr. Girma Ababi, the LUCS Foundation is dedicated to transforming lives through community health outreach, education access, healthcare access in underserved regions, professional empowerment & mentorship, and future healthcare infrastructure development.',
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
      { block_type: 'pillar', title: 'Community Health', metadata: { icon: 'heart-pulse' }, sort_order: 1 },
      { block_type: 'pillar', title: 'Education Access', metadata: { icon: 'graduation-cap' }, sort_order: 2 },
      { block_type: 'pillar', title: 'Healthcare Infrastructure', metadata: { icon: 'hospital' }, sort_order: 3 },
      { block_type: 'pillar', title: 'Professional Mentorship', metadata: { icon: 'handshake' }, sort_order: 4 },
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
      { block_type: 'award', title: 'Special Alumni Award for Extraordinary Achievement', body: 'Recognized by the University of Gondar with the Special Alumni Award for extraordinary achievement and distinguished contributions to healthcare and national development.', image_url: '/image.png', image_alt: 'Special Alumni Award for Extraordinary Achievement', metadata: { organization: 'University of Gondar', year: 2024, category: 'alumni' }, sort_order: 1 },
      { block_type: 'award', title: 'Vice Presidential Appointment – National Leadership', body: 'Appointed Vice President of the Ethiopian Healthcare Federation, recognizing national leadership in healthcare policy, strategy, and sector development.', image_url: '/image.png', image_alt: 'Vice Presidential Appointment – National Leadership', metadata: { organization: 'Ethiopian Healthcare Federation', year: 2023, category: 'leadership' }, sort_order: 2 },
      { block_type: 'award', title: 'Seed Program Graduate – Emerging Economies Leadership', body: 'Graduated from the Stanford GSB Seed Transformation Program, recognized for leadership in building transformative enterprises in emerging economies.', image_url: '/image.png', image_alt: 'Seed Program Graduate – Emerging Economies Leadership', metadata: { organization: 'Stanford University Graduate School of Business', year: 2021, category: 'industry' }, sort_order: 3 },
      { block_type: 'award', title: 'Rotarian – Community Leadership Member', body: 'Honored as a Rotarian and Community Leadership Member for dedicated service to community health and development initiatives.', image_url: '/image.png', image_alt: 'Rotarian – Community Leadership Member', metadata: { organization: 'Rotary International', year: 2023, category: 'professional' }, sort_order: 4 },
    ],
  },
  {
    slug: 'leadership_philosophy',
    section_type: 'quote',
    eyebrow: 'Leadership Philosophy',
    title: '',
    description: '"Building institutions, empowering professionals, and transforming healthcare for future generations — that is the only legacy worth pursuing."',
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
    description: 'Yanet Chain of Hospitals · Health Sciences College · Pharmaceuticals · 1,000+ employees',
    sort_order: 2,
  },
  {
    label: '03',
    title: 'Vice President, Ethiopian Healthcare Federation',
    description: 'National policy, strategy & regulatory advisory roles · Ministry of Health councils',
    sort_order: 3,
  },
  {
    label: '04',
    title: 'Board Chairman · Stanford GSB Alumni · Philanthropist',
    description: '4 boards · LUCS Foundation Founder & Patron · University of Gondar Special Alumni Awardee',
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

const parseJson = (value, fallback = {}) => {
  if (!value) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const serializeJson = (value) => JSON.stringify(value || {})

async function initCmsSchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS cms_sections (
      id INT NOT NULL AUTO_INCREMENT,
      slug VARCHAR(120) NOT NULL,
      section_type VARCHAR(80) NOT NULL DEFAULT 'generic',
      eyebrow VARCHAR(255) DEFAULT NULL,
      title TEXT DEFAULT NULL,
      subtitle TEXT DEFAULT NULL,
      description TEXT DEFAULT NULL,
      image_url VARCHAR(500) DEFAULT NULL,
      image_alt VARCHAR(255) DEFAULT NULL,
      metadata JSON DEFAULT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS cms_section_blocks (
      id INT NOT NULL AUTO_INCREMENT,
      section_id INT NOT NULL,
      block_type VARCHAR(80) NOT NULL DEFAULT 'content',
      eyebrow VARCHAR(255) DEFAULT NULL,
      title TEXT DEFAULT NULL,
      body TEXT DEFAULT NULL,
      image_url VARCHAR(500) DEFAULT NULL,
      image_alt VARCHAR(255) DEFAULT NULL,
      metadata JSON DEFAULT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      PRIMARY KEY (id),
      KEY section_id (section_id),
      CONSTRAINT cms_section_blocks_section_fk FOREIGN KEY (section_id) REFERENCES cms_sections (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS identity_items (
      id INT NOT NULL AUTO_INCREMENT,
      label VARCHAR(40) DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT DEFAULT NULL,
      icon VARCHAR(120) DEFAULT NULL,
      image_url VARCHAR(500) DEFAULT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS timeline_events (
      id INT NOT NULL AUTO_INCREMENT,
      slug VARCHAR(120) DEFAULT NULL,
      year VARCHAR(40) DEFAULT NULL,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) DEFAULT NULL,
      description TEXT DEFAULT NULL,
      category VARCHAR(80) DEFAULT 'milestone',
      icon VARCHAR(120) DEFAULT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `)

  await db.query(`
    CREATE TABLE IF NOT EXISTS navigation_items (
      id INT NOT NULL AUTO_INCREMENT,
      parent_id INT DEFAULT NULL,
      label VARCHAR(255) NOT NULL,
      path VARCHAR(500) DEFAULT NULL,
      target VARCHAR(40) DEFAULT '_self',
      sort_order INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      metadata JSON DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY parent_id (parent_id),
      CONSTRAINT navigation_items_parent_fk FOREIGN KEY (parent_id) REFERENCES navigation_items (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `)

  await seedCms()
}

async function seedCms() {
  for (const section of sectionSeeds) {
    const [[existingSection]] = await db.query('SELECT id FROM cms_sections WHERE slug = ?', [section.slug])
    if (!existingSection) {
      const [result] = await db.query(
        `INSERT INTO cms_sections
          (slug, section_type, eyebrow, title, subtitle, description, image_url, image_alt, metadata, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          section.slug,
          section.section_type,
          section.eyebrow || null,
          section.title || null,
          section.subtitle || null,
          section.description || null,
          section.image_url || null,
          section.image_alt || null,
          serializeJson(section.metadata),
          sectionSeeds.indexOf(section) + 1,
        ],
      )

      for (const block of section.blocks || []) {
        await db.query(
          `INSERT INTO cms_section_blocks
            (section_id, block_type, eyebrow, title, body, image_url, image_alt, metadata, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            result.insertId,
            block.block_type || 'content',
            block.eyebrow || null,
            block.title || null,
            block.body || null,
            block.image_url || null,
            block.image_alt || null,
            serializeJson(block.metadata),
            block.sort_order || 0,
          ],
        )
      }
    }
  }

  const [[identityCount]] = await db.query('SELECT COUNT(*) AS count FROM identity_items')
  if (identityCount.count === 0) {
    for (const item of identitySeeds) {
      await db.query(
        `INSERT INTO identity_items (label, title, description, icon, image_url, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [item.label, item.title, item.description, item.icon || null, item.image_url || null, item.sort_order],
      )
    }
  }

  const [[timelineCount]] = await db.query('SELECT COUNT(*) AS count FROM timeline_events')
  if (timelineCount.count === 0) {
    for (const event of timelineSeeds) {
      await db.query(
        `INSERT INTO timeline_events (slug, year, title, subtitle, description, category, icon, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.slug,
          event.year,
          event.title,
          event.subtitle,
          event.description,
          event.category,
          event.icon || null,
          event.sort_order,
        ],
      )
    }
  }

  const [[navCount]] = await db.query('SELECT COUNT(*) AS count FROM navigation_items')
  if (navCount.count === 0) {
    for (const item of navigationSeeds) {
      const [parent] = await db.query(
        `INSERT INTO navigation_items (parent_id, label, path, sort_order, metadata)
         VALUES (NULL, ?, ?, ?, ?)`,
        [item.label, item.path || null, item.sort_order, serializeJson({})],
      )

      for (const child of item.children || []) {
        await db.query(
          `INSERT INTO navigation_items (parent_id, label, path, sort_order, metadata)
           VALUES (?, ?, ?, ?, ?)`,
          [parent.insertId, child.label, child.path || null, child.sort_order, serializeJson({})],
        )
      }
    }
  }
}

async function getSections(slugs = SECTION_SLUGS) {
  const [sections] = await db.query(
    `SELECT * FROM cms_sections
     WHERE slug IN (${slugs.map(() => '?').join(',')})
     ORDER BY sort_order ASC, id ASC`,
    slugs,
  )
  const [blocks] = await db.query(
    `SELECT b.* FROM cms_section_blocks b
     INNER JOIN cms_sections s ON s.id = b.section_id
     WHERE s.slug IN (${slugs.map(() => '?').join(',')})
     ORDER BY b.sort_order ASC, b.id ASC`,
    slugs,
  )

  return sections.reduce((acc, section) => {
    acc[section.slug] = {
      ...section,
      metadata: parseJson(section.metadata),
      blocks: blocks
        .filter((block) => block.section_id === section.id)
        .map((block) => ({ ...block, metadata: parseJson(block.metadata) })),
    }
    return acc
  }, {})
}

async function getIdentityItems(includeInactive = false) {
  const [rows] = await db.query(
    `SELECT * FROM identity_items ${includeInactive ? '' : 'WHERE is_active = 1'}
     ORDER BY sort_order ASC, id ASC`,
  )
  return rows
}

async function getTimelineEvents(includeInactive = false) {
  const [rows] = await db.query(
    `SELECT * FROM timeline_events ${includeInactive ? '' : 'WHERE is_active = 1'}
     ORDER BY sort_order ASC, id ASC`,
  )
  return rows
}

function buildNavigationTree(rows, parentId = null) {
  return rows
    .filter((item) => item.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map((item) => ({
      ...item,
      metadata: parseJson(item.metadata),
      children: buildNavigationTree(rows, item.id),
    }))
}

async function getNavigation(includeInactive = false) {
  const [rows] = await db.query(
    `SELECT * FROM navigation_items ${includeInactive ? '' : 'WHERE is_active = 1'}
     ORDER BY parent_id ASC, sort_order ASC, id ASC`,
  )
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
  const connection = await db.getConnection()
  try {
    const { section = {}, blocks = [] } = req.body
    await connection.beginTransaction()

    await connection.query(
      `UPDATE cms_sections SET
        eyebrow = ?, title = ?, subtitle = ?, description = ?, image_url = ?, image_alt = ?, metadata = ?, is_active = ?
       WHERE slug = ?`,
      [
        section.eyebrow || null,
        section.title || null,
        section.subtitle || null,
        section.description || null,
        section.image_url || null,
        section.image_alt || null,
        serializeJson(section.metadata),
        section.is_active === 0 ? 0 : 1,
        req.params.slug,
      ],
    )

    const [[storedSection]] = await connection.query('SELECT id FROM cms_sections WHERE slug = ?', [req.params.slug])
    if (!storedSection) {
      await connection.rollback()
      return res.status(404).json({ message: 'Section not found' })
    }

    await connection.query('DELETE FROM cms_section_blocks WHERE section_id = ?', [storedSection.id])
    for (const [index, block] of blocks.entries()) {
      await connection.query(
        `INSERT INTO cms_section_blocks
          (section_id, block_type, eyebrow, title, body, image_url, image_alt, metadata, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          storedSection.id,
          block.block_type || 'content',
          block.eyebrow || null,
          block.title || null,
          block.body || null,
          block.image_url || null,
          block.image_alt || null,
          serializeJson(block.metadata),
          block.sort_order || index + 1,
          block.is_active === 0 ? 0 : 1,
        ],
      )
    }

    await connection.commit()
    res.json({ message: 'Section saved' })
  } catch (error) {
    await connection.rollback()
    res.status(500).json({ error: error.message })
  } finally {
    connection.release()
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
    const [result] = await db.query(
      `INSERT INTO identity_items (label, title, description, icon, image_url, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [label || null, title, description || null, icon || null, image_url || null, sort_order || 0, is_active === 0 ? 0 : 1],
    )
    res.status(201).json({ id: result.insertId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/identity-items/:id', verifyToken, async (req, res) => {
  try {
    const { label, title, description, icon, image_url, sort_order, is_active } = req.body
    await db.query(
      `UPDATE identity_items SET label = ?, title = ?, description = ?, icon = ?, image_url = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [
        label || null,
        title,
        description || null,
        icon || null,
        image_url || null,
        sort_order || 0,
        is_active === 0 ? 0 : 1,
        req.params.id,
      ],
    )
    res.json({ message: 'Identity item saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/identity-items/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM identity_items WHERE id = ?', [req.params.id])
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
    const { slug, year, title, subtitle, description, category, icon, sort_order, is_active } = req.body
    const [result] = await db.query(
      `INSERT INTO timeline_events (slug, year, title, subtitle, description, category, icon, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug || null,
        year || null,
        title,
        subtitle || null,
        description || null,
        category || 'milestone',
        icon || null,
        sort_order || 0,
        is_active === 0 ? 0 : 1,
      ],
    )
    res.status(201).json({ id: result.insertId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/timeline-events/:id', verifyToken, async (req, res) => {
  try {
    const { slug, year, title, subtitle, description, category, icon, sort_order, is_active } = req.body
    await db.query(
      `UPDATE timeline_events SET
        slug = ?, year = ?, title = ?, subtitle = ?, description = ?, category = ?, icon = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [
        slug || null,
        year || null,
        title,
        subtitle || null,
        description || null,
        category || 'milestone',
        icon || null,
        sort_order || 0,
        is_active === 0 ? 0 : 1,
        req.params.id,
      ],
    )
    res.json({ message: 'Timeline event saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/timeline-events/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM timeline_events WHERE id = ?', [req.params.id])
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
    const [result] = await db.query(
      `INSERT INTO navigation_items (parent_id, label, path, target, sort_order, is_active, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        parent_id || null,
        label,
        path || null,
        target || '_self',
        sort_order || 0,
        is_active === 0 ? 0 : 1,
        serializeJson(metadata),
      ],
    )
    res.status(201).json({ id: result.insertId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/navigation-items/:id', verifyToken, async (req, res) => {
  try {
    const { parent_id, label, path, target, sort_order, is_active, metadata } = req.body
    await db.query(
      `UPDATE navigation_items SET parent_id = ?, label = ?, path = ?, target = ?, sort_order = ?, is_active = ?, metadata = ?
       WHERE id = ?`,
      [
        parent_id || null,
        label,
        path || null,
        target || '_self',
        sort_order || 0,
        is_active === 0 ? 0 : 1,
        serializeJson(metadata),
        req.params.id,
      ],
    )
    res.json({ message: 'Navigation item saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/navigation-items/:id', verifyToken, async (req, res) => {
  try {
    await db.query('DELETE FROM navigation_items WHERE id = ?', [req.params.id])
    res.json({ message: 'Navigation item deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.initCmsSchema = initCmsSchema

module.exports = router
