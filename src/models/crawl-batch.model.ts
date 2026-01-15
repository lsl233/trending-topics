import { getDatabase } from '@/lib/db'
import { toCamelCase } from '@/utils/case-converter'

export interface CrawlBatch {
  batchId: string
  aiTitle: string
  aiContent: string
  createdAt: Date
}

export const crawlBatchRepository = {
  getLatestBatch: async (): Promise<CrawlBatch> => {
    const db = getDatabase()
    const batches = await db`SELECT * FROM crawl_batches ORDER BY created_at DESC LIMIT 1`
    return toCamelCase<CrawlBatch[]>(batches)[0]
  }
}