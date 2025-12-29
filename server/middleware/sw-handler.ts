// 在开发环境中处理 Service Worker 相关路径，避免 Vue Router 警告
export default defineEventHandler(event => {
  // 仅在开发环境中处理
  if (process.env.NODE_ENV === 'production') {
    return
  }

  const url = event.node.req.url || ''

  // 拦截 Service Worker 相关路径
  if (url === '/sw.js' || url.startsWith('/workbox-') || url === '/manifest.webmanifest') {
    // 返回 404，避免 Vue Router 处理这些路径
    event.node.res.statusCode = 404
    event.node.res.setHeader('Content-Type', 'application/javascript')
    event.node.res.end('')
    return
  }
})
