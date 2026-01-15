import postgres from 'postgres'
import { databaseConfig } from '../config/database'

let sql: postgres.Sql<Record<string, never>> | null = null

export const getDatabase = (): postgres.Sql<Record<string, never>> => {
  if (!sql) {
    sql = postgres(databaseConfig.url, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10
    })
  }
  return sql
}

export const closeDatabase = async (): Promise<void> => {
  if (sql) {
    await sql.end()
    sql = null
  }
}

export const testConnection = async (): Promise<boolean> => {
  try {
    const db = getDatabase()
    await db`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}