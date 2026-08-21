import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: 'mysql://root:password@localhost:3306/globalspec',
  },
} satisfies Config
