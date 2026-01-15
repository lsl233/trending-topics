import { trendingHistoryRepository } from '@/models/trending-history.model'
import { TrendingHistoryWithTopic } from '@/models/trending-history.model'

export const trendingHistoryService = {
  getHistoriesWithTopicByBatchId: async (batchId: string): Promise<TrendingHistoryWithTopic[]> => {
    return trendingHistoryRepository.getHistoriesWithTopicByBatchId(batchId)
  }
}
