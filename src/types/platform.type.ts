export const PLATFORM_CONFIGS = {
  weibo: {
    name: '微博',
    color: '#fa7d3c',
    icon: '📱'
  },
  hupu: {
    name: '虎扑',
    color: '#d32f2f',
    icon: '🏀'
  },
  zhihu: {
    name: '知乎',
    color: '#0084ff',
    icon: '💡'
  },
  douyin: {
    name: '抖音',
    color: '#fe2c55',
    icon: '🎵'
  },
  bilibili: {
    name: 'B站',
    color: '#fb7299',
    icon: '📺'
  }
} as const

export type PlatformKey = keyof typeof PLATFORM_CONFIGS

export interface PlatformConfig {
  name: string
  color: string
  icon: string
}
