// prisma.config.ts
import { defineConfig } from '@prisma/infra'

export default defineConfig({
  connectionString: process.env.DATABASE_URL,
})

