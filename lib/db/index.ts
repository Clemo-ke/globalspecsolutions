import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import * as schema from './schema'

declare global {
  // eslint-disable-next-line no-var
  var __mysql_pool: mysql.Pool | undefined
}

function createPool(): mysql.Pool {
  if (process.env.DATABASE_URL) {
    return mysql.createPool(process.env.DATABASE_URL)
  }
  return mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'test123',
    database: process.env.DB_NAME || 'globalspec',
    waitForConnections: true,
    connectionLimit: 15,
    maxIdle: 5,
    idleTimeout: 3000,
    queueLimit: 0,
  })
}

export const pool: mysql.Pool =
  process.env.NODE_ENV === 'production'
    ? createPool()
    : (global.__mysql_pool ?? (global.__mysql_pool = createPool()))

export const db = drizzle(pool, { schema, mode: 'default' })
