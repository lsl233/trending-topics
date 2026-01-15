
import type { FC, PropsWithChildren } from 'hono/jsx'


export const BaseLayout: FC<PropsWithChildren> = ({children}) => {


  return (
    <html>
      <head>
        <title>Trending Topics</title>
        <link rel="stylesheet" href="/static/css/home.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
