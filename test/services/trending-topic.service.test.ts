import { describe, it, expect, beforeEach, vi } from 'vitest'
import { trendingTopicService } from '../../src/services/trending-topic.service'
import type { TrendingTopic } from '../../src/models/trending-topic.model'

describe('trendingTopicService', () => {
  const mockTopics: TrendingTopic[] = [
    { id: 1, source: 'weibo', uniqueKey: 'key1', title: 'Topic 1', url: 'https://example.com/1', firstSeenAt: new Date() },
    { id: 2, source: 'weibo', uniqueKey: 'key2', title: 'Topic 2', url: 'https://example.com/2', firstSeenAt: new Date() },
  ]

  // Create mock implementation at module level
  const mockTrendingTopicRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByUniqueKey: vi.fn(),
    findBySource: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getLatest: vi.fn(),
    getTopicsByBatch: vi.fn(),
  }

  vi.mock('../../src/models/trending-topic.model', () => ({
    trendingTopicRepository: mockTrendingTopicRepository,
  }))

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllTopics', () => {
    it('should return all topics from repository', async () => {
      mockTrendingTopicRepository.findAll.mockImplementation(async () => mockTopics)

      const result = await trendingTopicService.getAllTopics()

      expect(mockTrendingTopicRepository.findAll).toHaveBeenCalledOnce()
      expect(result).toEqual(mockTopics)
    })

    it('should return empty array when no topics exist', async () => {
      mockTrendingTopicRepository.findAll.mockImplementation(async () => [])

      const result = await trendingTopicService.getAllTopics()

      expect(result).toEqual([])
    })
  })

  describe('getTopicById', () => {
    it('should return topic when valid id is provided', async () => {
      mockTrendingTopicRepository.findById.mockImplementation(async (id: number) => mockTopics[0])

      const result = await trendingTopicService.getTopicById(1)

      expect(mockTrendingTopicRepository.findById).toHaveBeenCalledWith(1)
      expect(result).toEqual(mockTopics[0])
    })

    it('should return undefined when topic not found', async () => {
      mockTrendingTopicRepository.findById.mockImplementation(async () => undefined)

      const result = await trendingTopicService.getTopicById(999)

      expect(result).toBeUndefined()
    })
  })

  describe('getTopicByUniqueKey', () => {
    it('should return topic when valid unique key is provided', async () => {
      mockTrendingTopicRepository.findByUniqueKey.mockImplementation(async (key: string) => mockTopics[0])

      const result = await trendingTopicService.getTopicByUniqueKey('key1')

      expect(mockTrendingTopicRepository.findByUniqueKey).toHaveBeenCalledWith('key1')
      expect(result).toEqual(mockTopics[0])
    })

    it('should return undefined when unique key not found', async () => {
      mockTrendingTopicRepository.findByUniqueKey.mockImplementation(async () => undefined)

      const result = await trendingTopicService.getTopicByUniqueKey('nonexistent-key')

      expect(result).toBeUndefined()
    })
  })

  describe('getTopicsBySource', () => {
    it('should return topics for specified source', async () => {
      const weiboTopics = mockTopics.filter(t => t.source === 'weibo')
      mockTrendingTopicRepository.findBySource.mockImplementation(async () => weiboTopics)

      const result = await trendingTopicService.getTopicsBySource('weibo')

      expect(mockTrendingTopicRepository.findBySource).toHaveBeenCalledWith('weibo')
      expect(result).toEqual(weiboTopics)
    })

    it('should return empty array when source has no topics', async () => {
      mockTrendingTopicRepository.findBySource.mockImplementation(async () => [])

      const result = await trendingTopicService.getTopicsBySource('unknown-source')

      expect(result).toEqual([])
    })
  })

  describe('createTopic', () => {
    it('should create topic via repository', async () => {
      const newTopic = { source: 'weibo', uniqueKey: 'new-key', title: 'New Topic', url: 'https://example.com/new' }
      const createdTopic = { id: 3, ...newTopic, firstSeenAt: null }
      mockTrendingTopicRepository.create.mockImplementation(async () => createdTopic)

      const result = await trendingTopicService.createTopic(newTopic)

      expect(mockTrendingTopicRepository.create).toHaveBeenCalledWith(newTopic)
      expect(result).toEqual(createdTopic)
    })
  })

  describe('updateTopic', () => {
    it('should update topic via repository', async () => {
      const updateData = { title: 'Updated Title' }
      const updatedTopic = { ...mockTopics[0], ...updateData }
      mockTrendingTopicRepository.update.mockImplementation(async () => updatedTopic)

      const result = await trendingTopicService.updateTopic(1, updateData)

      expect(mockTrendingTopicRepository.update).toHaveBeenCalledWith(1, updateData)
      expect(result).toEqual(updatedTopic)
    })

    it('should return undefined when topic not found for update', async () => {
      mockTrendingTopicRepository.update.mockImplementation(async () => undefined)

      const result = await trendingTopicService.updateTopic(999, { title: 'Updated' })

      expect(result).toBeUndefined()
    })
  })

  describe('deleteTopic', () => {
    it('should delete topic via repository and return true', async () => {
      mockTrendingTopicRepository.delete.mockImplementation(async () => true)

      const result = await trendingTopicService.deleteTopic(1)

      expect(mockTrendingTopicRepository.delete).toHaveBeenCalledWith(1)
      expect(result).toBe(true)
    })

    it('should return false when topic not found for deletion', async () => {
      mockTrendingTopicRepository.delete.mockImplementation(async () => false)

      const result = await trendingTopicService.deleteTopic(999)

      expect(result).toBe(false)
    })
  })

  describe('getLatestTopics', () => {
    it('should return latest topics with default limit', async () => {
      mockTrendingTopicRepository.getLatest.mockImplementation(async (limit: number = 50) => mockTopics)

      const result = await trendingTopicService.getLatestTopics()

      expect(mockTrendingTopicRepository.getLatest).toHaveBeenCalledWith(50)
      expect(result).toEqual(mockTopics)
    })

    it('should return latest topics with custom limit', async () => {
      mockTrendingTopicRepository.getLatest.mockImplementation(async (limit: number) => mockTopics.slice(0, 1))

      const result = await trendingTopicService.getLatestTopics(10)

      expect(mockTrendingTopicRepository.getLatest).toHaveBeenCalledWith(10)
      expect(result).toEqual(mockTopics.slice(0, 1))
    })
  })

  describe('getTopicsByBatch', () => {
    it('should return topics for specified batch', async () => {
      mockTrendingTopicRepository.getTopicsByBatch.mockImplementation(async () => mockTopics)

      // @ts-expect-error - testing invalid type input
      const result = await trendingTopicService.getTopicsByBatch('batch-123')

      expect(mockTrendingTopicRepository.getTopicsByBatch).toHaveBeenCalledWith('batch-123')
      expect(result).toEqual(mockTopics)
    })

    it('should return empty array when batch has no topics', async () => {
      mockTrendingTopicRepository.getTopicsByBatch.mockImplementation(async () => [])

      // @ts-expect-error - testing invalid type input
      const result = await trendingTopicService.getTopicsByBatch('empty-batch')

      expect(result).toEqual([])
    })
  })
})
