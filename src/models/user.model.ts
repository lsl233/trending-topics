import { getDatabase } from '@/lib/db'

interface User {
  id?: number
  name: string
  email: string
  createdAt?: Date
}

export const userRepository = {
  findAll: async (): Promise<User[]> => {
    const db = getDatabase()
    return db`SELECT * FROM users ORDER BY id DESC` as any
  },

  findById: async (id: number): Promise<User | undefined> => {
    const db = getDatabase()
    const users = await db`SELECT * FROM users WHERE id = ${id}`
    return users[0] as any
  },

  create: async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const db = getDatabase()
    const users = await db`INSERT INTO users ${db(user)} RETURNING *`
    return users[0] as any
  },

  update: async (id: number, user: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | undefined> => {
    const db = getDatabase()
    const users = await db`UPDATE users SET ${db(user)} WHERE id = ${id} RETURNING *`
    return users[0] as any
  },

  delete: async (id: number): Promise<boolean> => {
    const db = getDatabase()
    const result = await db`DELETE FROM users WHERE id = ${id}`
    return result.count > 0
  }
}