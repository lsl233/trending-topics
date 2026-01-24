import { getDatabase } from '@/lib/db'

export interface TrendingHistory {
  id: number
  topicId: number | null
  hotScore: number
  hotValueDisplay: string | null
  rank: number | null
  capturedAt: Date | null
  batchId: string
  metrics: Record<string, any> | null
}

export interface TrendingHistoryWithTopic extends TrendingHistory {
  topicTitle: string
  topicSource: string
  topicUrl: string
}

export const trendingHistoryRepository = {
  getHistoriesWithTopicByBatchId: async (batchId: string): Promise<TrendingHistoryWithTopic[]> => {
    const db = getDatabase()
    return db`
      SELECT
        h.id,
        h.topic_id,
        h.hot_score,
        h.hot_value_display,
        h.rank,
        h.captured_at,
        h.batch_id,
        h.metrics,
        t.title as topic_title,
        t.source as topic_source,
        t.url as topic_url
      FROM trending_history h
      JOIN trending_topics t ON h.topic_id = t.id
      WHERE h.batch_id = ${batchId}
      ORDER BY h.rank ASC
    ` as any
  },

  getHistoriesWithTopicByBatchIdAndSource: async (batchId: string, source: string): Promise<TrendingHistoryWithTopic[]> => {
    const db = getDatabase()
    return db`
      SELECT
        h.id,
        h.topic_id,
        h.hot_score,
        h.hot_value_display,
        h.rank,
        h.captured_at,
        h.batch_id,
        h.metrics,
        t.title as topic_title,
        t.source as topic_source,
        t.url as topic_url
      FROM trending_history h
      JOIN trending_topics t ON h.topic_id = t.id
      WHERE h.batch_id = ${batchId}
        AND t.source = ${source}
      ORDER BY h.rank ASC
    ` as any
  }
}