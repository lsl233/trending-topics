import { Hono } from 'hono'
import { About } from '@/views/about'

const about = new Hono()

about.get('/', (c) => {
  return c.html(<About />)
})

export { about }