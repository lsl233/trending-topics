import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateMockTrendingData, generateAllMockData } from '@/utils/mock-data'
import { rankingService } from '@/services/ranking.service'

const { mockCrawlBatchRepository, mockTrendingHistoryRepository } = vi.hoisted(() => ({
  mockCrawlBatchRepository: {
    getLatestBatch: vi.fn()
  },
  mockTrendingHistoryRepository: {
    getHistoriesWithTopicByBatchId: vi.fn()
  }
}))

vi.mock('@/models/crawl-batch.model', () => ({
  crawlBatchRepository: mockCrawlBatchRepository
}))

vi.mock('@/models/trending-history.model', () => ({
  trendingHistoryRepository: mockTrendingHistoryRepository
}))

describe('mock-data utils', () => {
  describe('generateMockTrendingData', () => {
    it('should generate 10 items for hupu', () => {
      const data = generateMockTrendingData('hupu', 10)
      expect(data).toHaveLength(10)
      expect(data[0].rank).toBe(1)
      expect(data[0].title).toBeTruthy()
      expect(data[0].hotScore).toBeTruthy()
      expect(data[0].url).toBeTruthy()
    })

    it('should generate 10 items for zhihu', () => {
      const data = generateMockTrendingData('zhihu', 10)
      expect(data).toHaveLength(10)
      expect(data[0].rank).toBe(1)
      expect(data[0].title).toBeTruthy()
      expect(data[0].hotScore).toContain('万热度')
    })

    it('should generate 10 items for douyin', () => {
      const data = generateMockTrendingData('douyin', 10)
      expect(data).toHaveLength(10)
      expect(data[0].hotScore).toContain('万播放')
    })

    it('should generate 10 items for bilibili', () => {
      const data = generateMockTrendingData('bilibili', 10)
      expect(data).toHaveLength(10)
      expect(data[0].hotScore).toContain('万播放')
    })

    it('should return empty array for unknown count', () => {
      const data = generateMockTrendingData('hupu', 0)
      expect(data).toHaveLength(0)
    })
  })

  describe('generateAllMockData', () => {
    it('should generate data for all platforms except weibo', () => {
      const data = generateAllMockData()
      expect(data).toHaveProperty('hupu')
      expect(data).toHaveProperty('zhihu')
      expect(data).toHaveProperty('douyin')
      expect(data).toHaveProperty('bilibili')
      expect(data.hupu).toHaveLength(10)
      expect(data.zhihu).toHaveLength(10)
      expect(data.douyin).toHaveLength(10)
      expect(data.bilibili).toHaveLength(10)
    })
  })
})

describe('rankingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get all platform trending with weibo data', async () => {
    mockCrawlBatchRepository.getLatestBatch.mockResolvedValue({
      batchId: 'batch-123',
      aiTitle: 'Test Title',
      aiContent: 'Test Content',
      createdAt: new Date()
    })

    mockTrendingHistoryRepository.getHistoriesWithTopicByBatchId.mockResolvedValue([
      {
        id: 1,
        topicId: 1,
        hotScore: 100000,
        hotValueDisplay: '10万',
        rank: 1,
        capturedAt: new Date(),
        batchId: 'batch-123',
        metrics: null,
        topicTitle: 'Test Topic',
        topicSource: 'weibo',
        topicUrl: '/test'
      }
    ])

    const data = await rankingService.getAllPlatformTrending()
    expect(data.length).toBeGreaterThan(0)
    expect(data[0]).toHaveProperty('platform')
    expect(data[0]).toHaveProperty('config')
    expect(data[0]).toHaveProperty('items')
  })

  it('should have weibo platform with real data when database has data', async () => {
    mockCrawlBatchRepository.getLatestBatch.mockResolvedValue({
      batchId: 'batch-123',
      aiTitle: 'Test Title',
      aiContent: 'Test Content',
      createdAt: new Date()
    })

    mockTrendingHistoryRepository.getHistoriesWithTopicByBatchId.mockResolvedValue([
      {
        id: 1,
        topicId: 1,
        hotScore: 100000,
        hotValueDisplay: '10万',
        rank: 1,
        capturedAt: new Date(),
        batchId: 'batch-123',
        metrics: null,
        topicTitle: 'Test Topic',
        topicSource: 'weibo',
        topicUrl: '/test'
      }
    ])

    const data = await rankingService.getAllPlatformTrending()
    const weiboPlatform = data.find((p) => p.platform === 'weibo')
    expect(weiboPlatform).toBeDefined()
    expect(weiboPlatform?.items[0].rank).toBe(1)
    expect(weiboPlatform?.items[0].title).toBe('Test Topic')
  })

  it('should have mock platforms with generated data', async () => {
    mockCrawlBatchRepository.getLatestBatch.mockResolvedValue({
      batchId: 'batch-123',
      aiTitle: 'Test Title',
      aiContent: 'Test Content',
      createdAt: new Date()
    })

    mockTrendingHistoryRepository.getHistoriesWithTopicByBatchId.mockResolvedValue([])

    const data = await rankingService.getAllPlatformTrending()
    const mockPlatforms = ['hupu', 'zhihu', 'douyin', 'bilibili']

    for (const platform of mockPlatforms) {
      const found = data.find((p) => p.platform === platform)
      expect(found).toBeDefined()
      expect(found?.items).toHaveLength(10)
    }
  })
})
