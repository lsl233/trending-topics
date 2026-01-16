import { marked } from 'marked'
import { CrawlBatch } from '@/models/crawl-batch.model'
import type { FC } from 'hono/jsx'
import type { TrendingHistoryWithTopic } from '@/models/trending-history.model'

export const Home: FC<{ latestBatch: CrawlBatch, histories: TrendingHistoryWithTopic[] }> = ({ latestBatch, histories }) => {
  const htmlContent = marked.parse(latestBatch.aiContent, { async: false }) as string
  console.log(new Date(latestBatch.createdAt))
  return (
    <>
      <title>{latestBatch.aiTitle.replace('## ', '')}</title>
      <link rel="stylesheet" href="/static/css/home.css" />

      <div className="min-h-screen bg-white">
        {/* 顶部导航/背景装饰（可选） */}
        {/* <div className="h-1 bg-gradient-to-r from-orange-400 to-red-500 w-full" /> */}

        {/* 主容器：在 lg 屏幕下使用 grid，在移动端是正常的块级布局 */}
        <div className="max-w-[1200px] mx-auto px-6 py-12 lg:grid lg:grid-cols-[340px_1fr] lg:gap-16">

          {/* 左侧：独立榜单模块 */}
          <aside className="mb-12 lg:mb-0">
            <div className="lg:sticky lg:top-12">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase">
                  榜单
                </h2>
              </div>

              <ul className="space-y-4">
                {histories.map((history, index) => (
                  <li key={history.topicId} className="group flex gap-4 items-center">
                    {/* 数字索引：保持极简感 */}
                    <span className="text-xs font-mono text-slate-300 mt-1 group-hover:text-orange-400 transition-colors">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>

                    <a
                      href={`https://s.weibo.com${history.topicUrl}`}
                      target="_blank"
                      className="text-[15px] leading-snug text-slate-600 group-hover:text-orange-600 transition-colors line-clamp-1 flex-1"
                    >
                      {history.topicTitle}
                    </a>

                    <span className="group-hover:text-orange-400 text-slate-400">
                      {history.hotScore}
                    </span>
                  </li>
                ))}
              </ul>

              {/* 移动端提示：如果列表很长，可以在此加一个展开更多，或者直接让它自然堆叠 */}
              <div className="mt-8 pt-6 border-t border-slate-100 hidden lg:block">
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  {/* 数据每 15 分钟更新一次<br /> */}
                  数据源自微博
                </p>
              </div>
            </div>
          </aside>

          {/* 右侧：文章详情模块 */}
          <main className="min-w-0"> {/* min-w-0 防止 grid 内容溢出 */}
            <article className="max-w-3xl md:max-w-full"> {/* 限制文章最大宽度，保证阅读体验 */}
              {/* 文章页眉 */}
              <header className="mb-12">
                {/* <div className="flex items-center gap-2 mb-6 text-sm text-slate-400">
                  <span>微博平台</span>
                  <span>/</span>
                  <span>深度精选</span>
                </div> */}

                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.2]">
                  {latestBatch.aiTitle.replace('## ', '')}
                </h1>

                <div className="flex items-center justify-between pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {/* <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div> */}
                    <div>
                      {/* <div className="text-sm font-bold text-slate-900">AI 智能分析助手</div> */}
                      <div className="text-xs text-slate-400">发布于今日 09:41</div>
                    </div>
                  </div>
                </div>
              </header>

              {/* 正文内容 */}
              <section
                className="prose prose-slate prose-lg max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight
                prose-p:text-slate-700 prose-p:leading-relaxed
                prose-a:text-orange-600 prose-a:font-medium hover:prose-a:text-orange-500
                prose-img:rounded-3xl
                prose-strong:text-slate-900"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* 底部互动或免责 */}
              <footer className="mt-24 py-12 border-t border-slate-100">
                <div className="bg-slate-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-slate-900 mb-1">觉得这篇总结有帮助吗？</h4>
                    <p className="text-sm text-slate-500">点击热榜话题可以查看原始讨论</p>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:shadow-sm transition-all">
                      分享洞察
                    </button>
                  </div>
                </div>
              </footer>
            </article>
          </main>
        </div>
      </div>
    </>
  )
}
