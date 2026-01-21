import { Hono } from 'hono'
import { users } from './user.route'
import { dbTest } from './db.route'
import { ranking } from './ranking.route'

const api = new Hono()

api.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

api.route('/users', users)
api.route('/db', dbTest)
api.route('/ranking', ranking)

export const apiRoutes = api