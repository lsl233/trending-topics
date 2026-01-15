import { Hono } from 'hono'
import { about } from './about.route'
import { Home } from '@/views/home'
import { crawlBatchService } from '@/services/crawl-batch.service'
import { trendingHistoryService } from '@/services/trending-history.service'
import { BaseLayout } from '@/views/layout/BaseLayout'

const pages = new Hono()

pages.use('*', async (c, next) => {
  c.setRenderer((content) => c.html(<BaseLayout>{content}</BaseLayout>))
  await next()
})

pages.get('/', async (c) => {
  const latestBatch = await crawlBatchService.getLatestBatch()
  const histories = await trendingHistoryService.getHistoriesWithTopicByBatchId(latestBatch.batchId)
  return c.html(<Home latestBatch={latestBatch} histories={histories} />)
})

pages.route('/about', about)

export const pageRoutes = pages