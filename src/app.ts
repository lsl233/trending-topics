import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { logger } from './middleware'
import { apiRoutes } from './routes/api'
import { pageRoutes } from './routes/pages'
import { join } from 'path'

const app = new Hono()

app.use('*', logger)

app.use('/static/*', serveStatic({
  root: join(process.cwd(), 'src', 'static'),
  rewriteRequestPath: (path) => path.replace(/^\/static/, '')
}))

app.route('/api', apiRoutes)
app.route('/', pageRoutes)

export default app