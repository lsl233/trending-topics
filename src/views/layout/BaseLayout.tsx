import type { FC, PropsWithChildren } from 'hono/jsx'

export const BaseLayout: FC<PropsWithChildren> = ({children}) => {
  return (
    <html>
      <head>
        <title>Trending Topics</title>
        <link rel="stylesheet" href="/static/css/home.css" />
      </head>
      <body>
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-slate-900 hover:text-slate-700">
              Trending Topics
            </a>
            <div className="flex gap-6">
              <a
                href="/"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                首页
              </a>
              <a
                href="/ranking"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                热门榜单
              </a>
              <a
                href="/about"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                关于
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
