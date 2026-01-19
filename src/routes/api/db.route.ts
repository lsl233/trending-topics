import { Hono } from 'hono'
import { getDatabase, testConnection } from '@/lib/db'

const dbTest = new Hono()

dbTest.get('/test', async (c) => {
  const isConnected = await testConnection()
  return c.json({ success: isConnected, message: isConnected ? 'Database connected' : 'Database connection failed' })
})

dbTest.get('/version', async (c) => {
  try {
    const db = getDatabase()
    const result = await db`SELECT version()`
    return c.json({ success: true, data: result[0] })
  } catch (error) {
    return c.json({ success: false, error: 'Failed to get database version' }, 500)
  }
})

export { dbTest }