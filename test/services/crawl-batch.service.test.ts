import { describe, it, expect, beforeEach, vi } from 'vitest'
import { crawlBatchService } from '../../src/services/crawl-batch.service'
import type { CrawlBatch } from '../../src/models/crawl-batch.model'

const { mockCrawlBatchRepository } = vi.hoisted(() => {
  return {
    mockCrawlBatchRepository: {
      getLatestBatch: vi.fn(),
    }
  }
})

vi.mock('../../src/models/crawl-batch.model', () => ({
  crawlBatchRepository: mockCrawlBatchRepository,
}))

describe('crawlBatchService', () => {
  const mockBatch: CrawlBatch = {
    batchId: 'batch-123',
    aiTitle: 'AI Analysis Title',
    aiContent: 'This is AI generated content',
    createdAt: new Date('2024-01-15T10:00:00Z'),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getLatestBatch', () => {
    it('should return the latest batch', async () => {
      mockCrawlBatchRepository.getLatestBatch.mockImplementation(async () => mockBatch)

      const result = await crawlBatchService.getLatestBatch()

      expect(mockCrawlBatchRepository.getLatestBatch).toHaveBeenCalledOnce()
      expect(result).toEqual(mockBatch)
    })

    it('should return all batch properties', async () => {
      mockCrawlBatchRepository.getLatestBatch.mockImplementation(async () => mockBatch)

      const result = await crawlBatchService.getLatestBatch()

      expect(result).toHaveProperty('batchId')
      expect(result).toHaveProperty('aiTitle')
      expect(result).toHaveProperty('aiContent')
      expect(result).toHaveProperty('createdAt')
      expect(result.batchId).toBe('batch-123')
      expect(result.aiTitle).toBe('AI Analysis Title')
      expect(result.aiContent).toBe('This is AI generated content')
      expect(result.createdAt).toBeInstanceOf(Date)
    })
  })
})
