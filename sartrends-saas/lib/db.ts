import { prisma } from './prisma'

export const db = {
  ...prisma,
  user: () => prisma.user,
  session: () => prisma.session,
}


