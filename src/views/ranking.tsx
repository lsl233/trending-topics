import type { FC } from 'hono/jsx'
import { PlatformTrending } from '@/services/ranking.service'
import { formatTime } from '@/utils/time'

interface RankingProps {
  data: PlatformTrending[]
  timestamp: Date
}

export const Ranking: FC<RankingProps> = ({ data, timestamp }) => {
  return (
    <>
      <title>全网热门榜单</title>
      <link rel="stylesheet" href="/static/css/home.css" />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              全网热门榜单
            </h1>
            <p className="text-slate-500 text-lg">
              实时聚合各大平台热门话题 · 数据更新于 {formatTime(timestamp, 'relative')}
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((platform) => (
              <PlatformCard key={platform.platform} platform={platform} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

interface PlatformCardProps {
  platform: PlatformTrending
}

const PlatformCard: FC<PlatformCardProps> = ({ platform }) => {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow h-[451px] flex flex-col">
      <header
        className="px-5 py-3 flex items-center gap-3 shrink-0"
        style={{ backgroundColor: `${platform.config.color}08` }}
      >
        <span className="text-xl">{platform.config.icon}</span>
        <div>
          <h2 className="font-bold text-slate-900 text-base">{platform.config.name}热榜</h2>
          <p className="text-[11px] text-slate-500">
            {platform.config.name === '微博' ? '实时数据' : '模拟演示'}
          </p>
        </div>
      </header>

      <ul className="divide-y divide-slate-100 overflow-y-auto flex-1">
        {platform.items.map((item) => (
          <li key={item.rank} className="group">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors block"
            >
              <span
                className={`text-sm font-bold w-6 h-6 flex items-center justify-center shrink-0 rounded ${
                  item.rank <= 3 ? 'text-white' : 'text-slate-500'
                }`}
                style={{
                  backgroundColor: item.rank <= 3 ? platform.config.color : '#f1f5f9'
                }}
              >
                {item.rank}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-900 leading-snug line-clamp-1 group-hover:text-slate-700">
                  {item.title}
                </p>
                <p className="text-xs text-slate-400 mt-1">{item.hotScore}</p>
              </div>

              <svg
                className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </article>
  )
}
