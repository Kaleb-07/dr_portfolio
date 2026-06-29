const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Foundation
  const foundation = await prisma.cms_sections.findUnique({
    where: { slug: 'foundation_story' },
  })
  const fMeta = JSON.parse(foundation.metadata || '{}')
  console.log('=== FOUNDATION (foundation_story) ===')
  console.log('Metadata keys:', Object.keys(fMeta))
  console.log('Stats:', JSON.stringify(fMeta.stats, null, 2))

  // Liyana Framework
  const liyana = await prisma.cms_sections.findUnique({
    where: { slug: 'liyana_framework' },
    include: { blocks: true },
  })
  const lMeta = JSON.parse(liyana.metadata || '{}')
  console.log('\n=== LIYANA FRAMEWORK (liyana_framework) ===')
  console.log('Metadata keys:', Object.keys(lMeta))
  console.log('Number of blocks:', liyana.blocks.length)
  liyana.blocks.forEach((b, i) => console.log(`  Block ${i + 1}: ${b.title}`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
