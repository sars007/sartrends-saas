import { PrismaClient } from '@/lib/prisma'
const prisma = new PrismaClient()
async function main() {
  const count = await prisma.template.count()
  console.log(`Templates count: ${count}`)
  const templates = await prisma.template.findMany({ select: { name: true, type: true } })
  console.log('Templates:', templates)
}
main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

