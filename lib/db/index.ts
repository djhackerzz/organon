import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import Database from 'better-sqlite3'
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3'
import * as demoSchema from './schema-demo'
import { isDemoMode, demoDatabasePath } from '@/lib/demo-mode'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

function createDemoDb() {
  const path = demoDatabasePath()
  mkdirSync(dirname(path), { recursive: true })
  return drizzleSqlite(new Database(path), {
    schema: demoSchema,
  }) as unknown as ReturnType<typeof drizzle<typeof schema>>
}

export const db = isDemoMode() ? createDemoDb() : drizzle(pool, { schema })
