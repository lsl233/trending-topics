import { PlatformKey } from '@/types/platform.type'

export interface MockTrendingItem {
  rank: number
  title: string
  hotScore: string
  url: string
}

const mockDataTemplates = {
  hupu: [
    '詹姆斯三双率队险胜',
    '勇士能否重返季后赛',
    '库里三分球历史地位',
    '足球世界杯前瞻讨论',
    '国足备战亚洲杯',
    'CBA季后赛预测',
    '梅西最新动态',
    'NBA自由市场分析',
    '中超联赛热点话题',
    'F1赛车最新战报'
  ],
  zhihu: [
    '如何评价最新的科技产品发布会',
    '职场新人如何快速成长',
    '程序员35岁危机真的存在吗',
    'ChatGPT对行业的影响分析',
    '买房还是租房的经济学思考',
    '一线城市工作生活平衡',
    '教育内卷的深层原因',
    '新能源车发展趋势',
    'AI绘画是否会取代画师',
    '现代婚姻制度的变化'
  ],
  douyin: [
    '2025最火的舞蹈挑战',
    '美食探店新发现',
    '旅行vlog攻略',
    '搞笑段子合集',
    '萌宠日常',
    '健身打卡挑战',
    '音乐翻唱大赛',
    '穿搭分享',
    '科技产品评测',
    '生活小妙招'
  ],
  bilibili: [
    '年度最佳游戏盘点',
    '动漫新番追番指南',
    '科技数码开箱',
    '美食制作教程',
    '知识科普视频',
    '音乐现场演出',
    '生活vlog日常',
    '电影影评解说',
    '手工DIY教程',
    '汽车测评'
  ]
}

const hotScoreTemplates = {
  hupu: () => `${Math.floor(Math.random() * 500 + 100)}万热度`,
  zhihu: () => `${Math.floor(Math.random() * 800 + 100)}万热度`,
  douyin: () => `${Math.floor(Math.random() * 1000 + 200)}万播放`,
  bilibili: () => `${Math.floor(Math.random() * 300 + 50)}万播放`
}

const urlTemplates = {
  hupu: (index: number) => `https://bbs.hupu.com/topic/${index + 100000}`,
  zhihu: (index: number) => `https://www.zhihu.com/question/${index + 10000000}`,
  douyin: (index: number) => `https://www.douyin.com/video/${index + 7000000000}`,
  bilibili: (index: number) => `https://www.bilibili.com/video/BV1${index}Xxx`
}

export function generateMockTrendingData(platform: Exclude<PlatformKey, 'weibo'>, count: number = 10): MockTrendingItem[] {
  const templates = mockDataTemplates[platform]
  const scoreTemplate = hotScoreTemplates[platform]
  const urlTemplate = urlTemplates[platform]

  if (!templates || !scoreTemplate || !urlTemplate) {
    return []
  }

  const data: MockTrendingItem[] = []
  const shuffledTemplates = [...templates].sort(() => Math.random() - 0.5)

  for (let i = 0; i < count && i < shuffledTemplates.length; i++) {
    data.push({
      rank: i + 1,
      title: shuffledTemplates[i],
      hotScore: scoreTemplate(),
      url: urlTemplate(i)
    })
  }

  return data
}

export function generateAllMockData() {
  return {
    hupu: generateMockTrendingData('hupu', 10),
    zhihu: generateMockTrendingData('zhihu', 10),
    douyin: generateMockTrendingData('douyin', 10),
    bilibili: generateMockTrendingData('bilibili', 10)
  }
}
