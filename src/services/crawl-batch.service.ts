import { crawlBatchRepository } from '@/models/crawl-batch.model'
import { CrawlBatch } from '@/models/crawl-batch.model'

export const crawlBatchService = {
  getLatestBatch: async (): Promise<CrawlBatch> => {
    return crawlBatchRepository.getLatestBatch()
  }
}
