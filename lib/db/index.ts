import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

declare global {
  // eslint-disable-next-line no-var
  var __mysql_pool: mysql.Pool | undefined
}

function createPool(): mysql.Pool {
  return mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'globalspec',
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  })
}

// In development, cache the pool on globalThis so Turbopack hot-reloads
// don't create a new pool on every module re-evaluation.
// In production a fresh pool is fine because modules only load once.
export const pool: mysql.Pool =
  process.env.NODE_ENV === 'production'
    ? createPool()
    : (global.__mysql_pool ?? (global.__mysql_pool = createPool()))

export const db = drizzle(pool, { schema, mode: 'default' })
