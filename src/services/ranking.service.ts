import { crawlBatchRepository } from '@/models/crawl-batch.model'
import { trendingHistoryRepository } from '@/models/trending-history.model'
import { generateMockTrendingData } from '@/utils/mock-data'
import { PLATFORM_CONFIGS, PlatformKey } from '@/types/platform.type'

export interface TrendingItem {
  rank: number
  title: string
  hotScore: string
  url: string
}

export interface PlatformTrending {
  platform: PlatformKey
  config: {
    name: string
    color: string
    icon: string
  }
  items: TrendingItem[]
}

export const rankingService = {
  getAllPlatformTrending: async (): Promise<PlatformTrending[]> => {
    const result: PlatformTrending[] = []

    const latestBatch = await crawlBatchRepository.getLatestBatch()

    if (latestBatch) {
      // Fetch Weibo data from database
      const weiboHistories = await trendingHistoryRepository.getHistoriesWithTopicByBatchIdAndSource(
        latestBatch.batchId,
        'weibo'
      )

      const weiboItems: TrendingItem[] = weiboHistories
        .filter((h) => h.rank !== null)
        .map((h) => ({
          rank: h.rank as number,
          title: h.topicTitle,
          hotScore: h.hotScore.toString(),
          url: `https://s.weibo.com${h.topicUrl}`
        }))

      result.push({
        platform: 'weibo',
        config: PLATFORM_CONFIGS.weibo,
        items: weiboItems
      })

      // Fetch Hupu data from database
      const hupuHistories = await trendingHistoryRepository.getHistoriesWithTopicByBatchIdAndSource(
        latestBatch.batchId,
        'hupu'
      )

      const hupuItems: TrendingItem[] = hupuHistories
        .filter((h) => h.rank !== null)
        .map((h) => ({
          rank: h.rank as number,
          title: h.topicTitle,
          hotScore: h.hotScore.toString(),
          url: h.topicUrl
        }))

      result.push({
        platform: 'hupu',
        config: PLATFORM_CONFIGS.hupu,
        items: hupuItems
      })
    }

    const mockPlatforms: Exclude<PlatformKey, 'weibo' | 'hupu'>[] = ['zhihu', 'douyin', 'bilibili']

    for (const platform of mockPlatforms) {
      const mockItems = generateMockTrendingData(platform, 10)
      result.push({
        platform,
        config: PLATFORM_CONFIGS[platform],
        items: mockItems
      })
    }

    return result
  },

  getPlatformTrending: async (platform: PlatformKey): Promise<PlatformTrending | null> => {
    const allTrending = await rankingService.getAllPlatformTrending()
    return allTrending.find((t) => t.platform === platform) || null
  }
}
