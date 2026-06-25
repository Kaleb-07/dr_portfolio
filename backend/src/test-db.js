const prisma = require('./db/prisma')

async function test() {
  try {
    const admin = await prisma.admin.findFirst()
    console.log('DB OK:', admin)
  } catch (err) {
    console.error('DB ERROR:', err)
  } finally {
    await prisma.$disconnect()
  }
}

test()
