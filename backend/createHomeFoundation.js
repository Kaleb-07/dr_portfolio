const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Fetch existing foundation_story to get its stats and pillars (blocks)
  const existing = await prisma.cms_sections.findUnique({
    where: { slug: 'foundation_story' },
    include: { blocks: true },
  })
  if (!existing) {
    console.log('foundation_story not found')
    return
  }

  // Parse metadata to extract stats
  const oldMeta = JSON.parse(existing.metadata || '{}')
  const stats = oldMeta.stats || []

  // Extract pillars (block_type: 'pillar')
  const pillars = existing.blocks
    .filter((b) => b.block_type === 'pillar')
    .map((b) => ({
      block_type: b.block_type,
      title: b.title,
      body: b.body,
      metadata: b.metadata,
      sort_order: b.sort_order,
      image_url: b.image_url,
      image_alt: b.image_alt,
      eyebrow: b.eyebrow,
    }))

  // Create home_foundation section
  const newSection = await prisma.cms_sections.upsert({
    where: { slug: 'home_foundation' },
    update: {
      section_type: 'foundation_preview',
      eyebrow: existing.eyebrow,
      title: existing.title,
      subtitle: existing.subtitle,
      description: existing.description,
      image_url: existing.image_url,
      image_alt: existing.image_alt,
      metadata: JSON.stringify({ stats, cta: oldMeta.cta || [] }),
      is_active: true,
    },
    create: {
      slug: 'home_foundation',
      section_type: 'foundation_preview',
      eyebrow: existing.eyebrow,
      title: existing.title,
      subtitle: existing.subtitle,
      description: existing.description,
      image_url: existing.image_url,
      image_alt: existing.image_alt,
      metadata: JSON.stringify({ stats, cta: oldMeta.cta || [] }),
      sort_order: existing.sort_order, // optional
      is_active: true,
    },
  })

  // Delete old blocks for this new section (if any) and insert pillars
  await prisma.cms_section_blocks.deleteMany({
    where: { section_id: newSection.id },
  })

  if (pillars.length > 0) {
    await prisma.cms_section_blocks.createMany({
      data: pillars.map((p) => ({
        ...p,
        section_id: newSection.id,
        metadata: typeof p.metadata === 'object' ? JSON.stringify(p.metadata) : p.metadata,
      })),
    })
  }

  console.log('✅ home_foundation section created with stats and pillars.')
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
