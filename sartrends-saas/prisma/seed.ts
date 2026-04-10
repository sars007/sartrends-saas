import { prisma } from '../lib/db'
import { hashPassword } from '../lib/auth'

async function main() {
  // Admin
  const hashedAdminPw = await hashPassword('admin123')
  await prisma.user.upsert({
    where: { email: 'admin@sartrends.store' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@sartrends.store',
      password: hashedAdminPw,
      role: 'admin',
    },
  })

  // Broker
  const hashedBrokerPw = await hashPassword('broker123')
  const broker = await prisma.user.upsert({
    where: { email: 'broker@sartrends.store' },
    update: {},
    create: {
      name: 'Broker User',
      email: 'broker@sartrends.store',
      password: hashedBrokerPw,
      role: 'broker',
    },
  })

  // Driver
  const hashedDriverPw = await hashPassword('driver123')
  const driver = await prisma.user.upsert({
    where: { email: 'driver@sartrends.store' },
    update: {},
    create: {
      name: 'Driver User',
      email: 'driver@sartrends.store',
      password: hashedDriverPw,
      role: 'driver',
    },
  })

  // Subscription
  await prisma.subscription.upsert({
    where: { userId: broker.id },
    update: {},
    create: {
      userId: broker.id,
      plan: 'team',
      allowedSessions: 5,
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active',
    },
  })

  // Driver profile
  await prisma.driver.upsert({
    where: { userId: driver.id },
    update: {},
    create: {
      userId: driver.id,
      truckType: 'dryVan',
      location: 'Los Angeles, CA',
      availability: true,
      rating: 4.8,
    },
  })

  // Sample load
  await prisma.load.create({
    data: {
      brokerId: broker.id,
      pickupLocation: 'Los Angeles, CA',
      dropoffLocation: 'Las Vegas, NV',
      distance: 270,
      ratePerMile: 2.5,
      totalRate: 675,
      weight: 40000,
      trailerType: 'dryVan',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  })

  console.log('Seed complete')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

