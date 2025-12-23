import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // seed data placeholder
  console.log('Seeding placeholder data')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
