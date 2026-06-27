const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function seed() {
  try {
    console.log('🌱 Seeding database...')

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.admin.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: hashedPassword,
      },
    })

    console.log('✅ Admin user created:', admin.email)
    console.log('🔑 Password: admin123')
    console.log('')
    console.log('You can now login with:')
    console.log('  Email: admin@example.com')
    console.log('  Password: admin123')
    console.log('')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
