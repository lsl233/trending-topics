import { Hono } from 'hono'
import { userService } from '@/services/user.service'

const users = new Hono()

users.get('/', async (c) => {
  const users = await userService.getAllUsers()
  return c.json({ success: true, data: users })
})

users.get('/:id', async (c) => {
  const id = c.req.param('id')
  const user = await userService.getUserById(id)
  if (!user) {
    return c.json({ success: false, error: 'User not found' }, 404)
  }
  return c.json({ success: true, data: user })
})

users.post('/', async (c) => {
  const body = await c.req.json()
  const user = await userService.createUser(body)
  return c.json({ success: true, data: user }, 201)
})

export { users }