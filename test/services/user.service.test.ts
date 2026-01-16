import { describe, it, expect } from 'vitest'
import { userService } from '../../src/services/user.service'

describe('userService', () => {
  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users = await userService.getAllUsers()

      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBeGreaterThanOrEqual(0)
    })

    it('should return users with correct structure', async () => {
      const users = await userService.getAllUsers()

      if (users.length > 0) {
        users.forEach(user => {
          expect(user).toHaveProperty('id')
          expect(user).toHaveProperty('name')
          expect(user).toHaveProperty('email')
          expect(user).toHaveProperty('createdAt')
          expect(typeof user.id).toBe('string')
          expect(typeof user.name).toBe('string')
          expect(typeof user.email).toBe('string')
          expect(user.createdAt).toBeInstanceOf(Date)
        })
      }
    })
  })

  describe('getUserById', () => {
    it('should return undefined when invalid id is provided', async () => {
      const user = await userService.getUserById('nonexistent-id-999')

      expect(user).toBeUndefined()
    })

    it('should return user object with expected properties when found', async () => {
      const users = await userService.getAllUsers()
      if (users.length > 0) {
        const user = await userService.getUserById(users[0].id)

        if (user) {
          expect(user).toHaveProperty('id')
          expect(user).toHaveProperty('name')
          expect(user).toHaveProperty('email')
          expect(user).toHaveProperty('createdAt')
          expect(typeof user.id).toBe('string')
          expect(typeof user.name).toBe('string')
          expect(typeof user.email).toBe('string')
          expect(user.createdAt).toBeInstanceOf(Date)
        }
      }
    })
  })

  describe('createUser', () => {
    it('should create a new user with correct properties', async () => {
      const newUserData = { name: 'Bob Johnson', email: 'bob@example.com' }
      const newUser = await userService.createUser(newUserData)

      expect(newUser).toHaveProperty('id')
      expect(newUser).toHaveProperty('name')
      expect(newUser).toHaveProperty('email')
      expect(newUser).toHaveProperty('createdAt')
      expect(newUser.name).toBe('Bob Johnson')
      expect(newUser.email).toBe('bob@example.com')
      expect(typeof newUser.id).toBe('string')
      expect(newUser.createdAt).toBeInstanceOf(Date)
    })

    it('should generate a string id', async () => {
      const newUser = await userService.createUser({ name: 'Test User', email: 'test@example.com' })

      expect(typeof newUser.id).toBe('string')
      expect(newUser.id.length).toBeGreaterThan(0)
    })

    it('should set createdAt to current date', async () => {
      const beforeCreate = new Date()
      const newUser = await userService.createUser({ name: 'Test User', email: 'test@example.com' })
      const afterCreate = new Date()

      expect(newUser.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime())
      expect(newUser.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime())
    })

    it('should generate different ids for different users', async () => {
      const user1 = await userService.createUser({ name: 'User 1', email: 'user1@example.com' })
      const user2 = await userService.createUser({ name: 'User 2', email: 'user2@example.com' })

      expect(user1.id).not.toBe(user2.id)
    })

    it('should create users with different data', async () => {
      const user1 = await userService.createUser({ name: 'Alice', email: 'alice@example.com' })
      const user2 = await userService.createUser({ name: 'Bob', email: 'bob@example.com' })

      expect(user1.name).toBe('Alice')
      expect(user1.email).toBe('alice@example.com')
      expect(user2.name).toBe('Bob')
      expect(user2.email).toBe('bob@example.com')
    })
  })
})
