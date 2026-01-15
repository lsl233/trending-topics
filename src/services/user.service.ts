import { User, CreateUserDto } from '../types/user.type'

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date() }
]

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    return users
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    return users.find(user => user.id === id)
  },

  createUser: async (dto: CreateUserDto): Promise<User> => {
    const newUser: User = {
      id: String(users.length + 1),
      name: dto.name,
      email: dto.email,
      createdAt: new Date()
    }
    users.push(newUser)
    return newUser
  }
}