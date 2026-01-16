import { describe, it, expect, beforeEach, vi } from 'vitest'
import { trendingHistoryService } from '../../src/services/trending-history.service'
import type { TrendingHistoryWithTopic } from '../../src/models/trending-history.model'

describe('trendingHistoryService', () => {
  const mockHistories: TrendingHistoryWithTopic[] = [
    {
      id: 1,
      topicId: 1,
      hotScore: 1000,
      hotValueDisplay: '1000万',
      rank: 1,
      capturedAt: new Date(),
      batchId: 'batch-123',
      metrics: { views: 10000, likes: 500 },
      topicTitle: 'Topic 1',
      topicSource: 'weibo',
      topicUrl: 'https://example.com/1',
    },
    {
      id: 2,
      topicId: 2,
      hotScore: 800,
      hotValueDisplay: '800万',
      rank: 2,
      capturedAt: new Date(),
      batchId: 'batch-123',
      metrics: { views: 8000, likes: 400 },
      topicTitle: 'Topic 2',
      topicSource: 'weibo',
      topicUrl: 'https://example.com/2',
    },
  ]

  const mockTrendingHistoryRepository = {
    getHistoriesWithTopicByBatchId: vi.fn(),
  }

  vi.mock('../../src/models/trending-history.model', () => ({
    trendingHistoryRepository: mockTrendingHistoryRepository,
  }))

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getHistoriesWithTopicByBatchId', () => {
    it('should return histories with topic info for specified batch', async () => {
      mockTrendingHistoryRepository.getHistoriesWithTopicByBatchId.mockImplementation(async () => mockHistories)

      const result = await trendingHistoryService.getHistoriesWithTopicByBatchId('batch-123')

      expect(mockTrendingHistoryRepository.getHistoriesWithTopicByBatchId).toHaveBeenCalledWith('batch-123')
      expect(result).toEqual(mockHistories)
    })

    it('should return empty array when batch has no histories', async () => {
      mockTrendingHistoryRepository.getHistoriesWithTopicByBatchId.mockImplementation(async () => [])

      const result = await trendingHistoryService.getHistoriesWithTopicByBatchId('empty-batch')

      expect(result).toEqual([])
    })

    it('should preserve all history properties', async () => {
      mockTrendingHistoryRepository.getHistoriesWithTopicByBatchId.mockImplementation(async () => mockHistories)

      const result = await trendingHistoryService.getHistoriesWithTopicByBatchId('batch-123')

      result.forEach(history => {
        expect(history).toHaveProperty('id')
        expect(history).toHaveProperty('topicId')
        expect(history).toHaveProperty('hotScore')
        expect(history).toHaveProperty('hotValueDisplay')
        expect(history).toHaveProperty('rank')
        expect(history).toHaveProperty('capturedAt')
        expect(history).toHaveProperty('batchId')
        expect(history).toHaveProperty('metrics')
        expect(history).toHaveProperty('topicTitle')
        expect(history).toHaveProperty('topicSource')
        expect(history).toHaveProperty('topicUrl')
      })
    })
  })
})
