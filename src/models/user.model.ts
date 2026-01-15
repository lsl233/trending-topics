import { getDatabase } from '@/lib/db'
import { toCamelCase } from '@/utils/case-converter'

interface User {
  id?: number
  name: string
  email: string
  createdAt?: Date
}

export const userRepository = {
  findAll: async (): Promise<User[]> => {
    const db = getDatabase()
    const users = await db`SELECT * FROM users ORDER BY id DESC`
    return toCamelCase<User[]>(users)
  },

  findById: async (id: number): Promise<User | undefined> => {
    const db = getDatabase()
    const users = await db`SELECT * FROM users WHERE id = ${id}`
    return toCamelCase<User[]>(users)[0]
  },

  create: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const db = getDatabase()
    const users = await db`INSERT INTO users ${db(user)} RETURNING *`
    return toCamelCase<User[]>(users)[0]
  },

  update: async (id: number, user: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> => {
    const db = getDatabase()
    const users = await db`UPDATE users SET ${db(user)} WHERE id = ${id} RETURNING *`
    return toCamelCase<User[]>(users)[0]
  },

  delete: async (id: number): Promise<boolean> => {
    const db = getDatabase()
    const result = await db`DELETE FROM users WHERE id = ${id}`
    return result.count > 0
  }
}