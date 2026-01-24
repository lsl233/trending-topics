import app from './app'

// 打印所有路由地址
function printRoutes() {
  const routes = app.routes
  console.log('\n🚀 路由列表:')
  console.log('─'.repeat(50))
  for (const route of routes) {
    const method = route.method.padEnd(7)
    const path = route.path
    console.log(`  ${method} ${path}`)
  }
  console.log('─'.repeat(50))
  console.log('')
}

printRoutes()

export default {
  port: 3002,
  fetch: app.fetch
}