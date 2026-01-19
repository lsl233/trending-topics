import { getDatabase } from '@/lib/db'

export interface TrendingTopic {
  id: number
  source: string
  uniqueKey: string
  title: string
  url: string
  firstSeenAt: Date | null
}

export interface CreateTrendingTopicDto {
  source: string
  uniqueKey: string
  title: string
  url: string
  firstSeenAt?: Date
}

export interface UpdateTrendingTopicDto {
  source?: string
  uniqueKey?: string
  title?: string
  url?: string
  firstSeenAt?: Date
}

export const trendingTopicRepository = {
  findAll: async (): Promise<TrendingTopic[]> => {
    const db = getDatabase()
    return db`SELECT * FROM trending_topics ORDER BY first_seen_at DESC` as any
  },

  findById: async (id: number): Promise<TrendingTopic | undefined> => {
    const db = getDatabase()
    const topics = await db`SELECT * FROM trending_topics WHERE id = ${id}`
    return topics[0] as any
  },

  findByUniqueKey: async (uniqueKey: string): Promise<TrendingTopic | undefined> => {
    const db = getDatabase()
    const topics = await db`SELECT * FROM trending_topics WHERE unique_key = ${uniqueKey}`
    return topics[0] as any
  },

  findBySource: async (source: string): Promise<TrendingTopic[]> => {
    const db = getDatabase()
    return db`SELECT * FROM trending_topics WHERE source = ${source} ORDER BY first_seen_at DESC` as any
  },

  create: async (dto: CreateTrendingTopicDto): Promise<TrendingTopic> => {
    const db = getDatabase()
    const topics = await db`INSERT INTO trending_topics ${db(dto)} RETURNING *`
    return topics[0] as any
  },

  update: async (id: number, dto: UpdateTrendingTopicDto): Promise<TrendingTopic | undefined> => {
    const db = getDatabase()
    const topics = await db`UPDATE trending_topics SET ${db(dto)} WHERE id = ${id} RETURNING *`
    return topics[0] as any
  },

  delete: async (id: number): Promise<boolean> => {
    const db = getDatabase()
    const result = await db`DELETE FROM trending_topics WHERE id = ${id}`
    return result.count > 0
  },

  getLatest: async (limit: number = 50): Promise<TrendingTopic[]> => {
    const db = getDatabase()
    return db`SELECT * FROM trending_topics ORDER BY first_seen_at DESC LIMIT ${limit}` as any
  },

  getTopicsByBatch: async (batchId: number): Promise<TrendingTopic[]> => {
    const db = getDatabase()
    return db`
      SELECT DISTINCT t.*
      FROM trending_topics t
      INNER JOIN trending_history h ON t.id = h.topic_id
      WHERE h.batch_id = ${batchId}
      ORDER BY h.rank ASC
    ` as any
  }
}