const prisma = require('../../../prisma')

class AwardsService {
  async getAwards() {
    const awards = await prisma.cms_sections.findFirst({
      where: { slug: 'recognition_awards' },
      include: {
        blocks: {
          orderBy: { sort_order: 'asc' },
        },
      },
    })
    return awards
  }

  async updateAwards(data) {
    const existing = await prisma.cms_sections.findFirst({
      where: { slug: 'recognition_awards' },
    })

    if (!existing) {
      return await prisma.cms_sections.create({
        data: {
          slug: 'recognition_awards',
          section_type: data.section_type || 'awards_carousel',
          eyebrow: data.eyebrow || null,
          title: data.title || null,
          subtitle: data.subtitle || null,
          description: data.description || null,
          image_url: data.image_url || null,
          image_alt: data.image_alt || null,
          metadata: data.metadata || {},
          blocks: data.blocks
            ? {
                create: data.blocks.map((block) => ({
                  block_type: block.block_type || 'content',
                  eyebrow: block.eyebrow || null,
                  title: block.title || null,
                  body: block.body || null,
                  image_url: block.image_url || null,
                  image_alt: block.image_alt || null,
                  metadata: block.metadata || {},
                  sort_order: block.sort_order || 0,
                })),
              }
            : undefined,
        },
        include: {
          blocks: true,
        },
      })
    }

    // Update section
    await prisma.cms_sections.update({
      where: { id: existing.id },
      data: {
        section_type: data.section_type !== undefined ? data.section_type : existing.section_type,
        eyebrow: data.eyebrow !== undefined ? data.eyebrow : existing.eyebrow,
        title: data.title !== undefined ? data.title : existing.title,
        subtitle: data.subtitle !== undefined ? data.subtitle : existing.subtitle,
        description: data.description !== undefined ? data.description : existing.description,
        image_url: data.image_url !== undefined ? data.image_url : existing.image_url,
        image_alt: data.image_alt !== undefined ? data.image_alt : existing.image_alt,
        metadata: data.metadata !== undefined ? data.metadata : existing.metadata,
      },
    })

    // Update blocks if provided
    if (data.blocks && Array.isArray(data.blocks)) {
      // Delete existing blocks
      await prisma.cms_section_blocks.deleteMany({
        where: { section_id: existing.id },
      })

      // Create new blocks
      await prisma.cms_section_blocks.createMany({
        data: data.blocks.map((block) => ({
          section_id: existing.id,
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

    // Return updated section with blocks
    return await prisma.cms_sections.findUnique({
      where: { id: existing.id },
      include: {
        blocks: {
          orderBy: { sort_order: 'asc' },
        },
      },
    })
  }
}

module.exports = new AwardsService()
