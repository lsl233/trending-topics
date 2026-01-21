import { Hono } from 'hono'
import { rankingService } from '@/services/ranking.service'

const ranking = new Hono()

ranking.get('/all', async (c) => {
  try {
    const data = await rankingService.getAllPlatformTrending()
    return c.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching rankings:', error)
    return c.json({ success: false, error: 'Failed to fetch rankings' }, 500)
  }
})

ranking.get('/:platform', async (c) => {
  const platform = c.req.param('platform') as any
  try {
    const data = await rankingService.getPlatformTrending(platform)
    if (!data) {
      return c.json({ success: false, error: 'Platform not found' }, 404)
    }
    return c.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching platform ranking:', error)
    return c.json({ success: false, error: 'Failed to fetch platform ranking' }, 500)
  }
})

export { ranking }
