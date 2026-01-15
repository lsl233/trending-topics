import { trendingTopicRepository } from '@/models/trending-topic.model'
import { TrendingTopic, CreateTrendingTopicDto, UpdateTrendingTopicDto } from '@/models/trending-topic.model'

export const trendingTopicService = {
  getAllTopics: async (): Promise<TrendingTopic[]> => {
    return trendingTopicRepository.findAll()
  },

  getTopicById: async (id: number): Promise<TrendingTopic | undefined> => {
    return trendingTopicRepository.findById(id)
  },

  getTopicByUniqueKey: async (uniqueKey: string): Promise<TrendingTopic | undefined> => {
    return trendingTopicRepository.findByUniqueKey(uniqueKey)
  },

  getTopicsBySource: async (source: string): Promise<TrendingTopic[]> => {
    return trendingTopicRepository.findBySource(source)
  },

  createTopic: async (dto: CreateTrendingTopicDto): Promise<TrendingTopic> => {
    return trendingTopicRepository.create(dto)
  },

  updateTopic: async (id: number, dto: UpdateTrendingTopicDto): Promise<TrendingTopic | undefined> => {
    return trendingTopicRepository.update(id, dto)
  },

  deleteTopic: async (id: number): Promise<boolean> => {
    return trendingTopicRepository.delete(id)
  },

  getLatestTopics: async (limit: number = 50): Promise<TrendingTopic[]> => {
    return trendingTopicRepository.getLatest(limit)
  },

  getTopicsByBatch: async (batchId: number): Promise<TrendingTopic[]> => {
    return trendingTopicRepository.getTopicsByBatch(batchId)
  }
}
