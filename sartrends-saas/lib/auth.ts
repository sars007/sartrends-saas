import { hash, compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db' // singleton prisma client, create if missing
import type { User, Role } from '@prisma/client'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) throw new Error('JWT_SECRET missing')

export async function hashPassword(password: string) {
  const hashed = await hash(password, 12)
  return hashed
}

export async function verifyPassword(hash: string, password: string) {
  const isValid = await compare(password, hash)
  return isValid
}

export function createJWT(user: Pick<User, 'id' | 'role'>) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJWT(token: string): { sub: string; role: Role } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; role: Role }
    return decoded
  } catch {
    return null
  }
}

export async function getUserFromCookie() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value
  if (!token) return null
  return verifyJWT(token)
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function createUser(data: { name: string; email: string; password: string; role?: Role }) {
  const hashedPassword = await hashPassword(data.password)
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user',
    },
  })
}
