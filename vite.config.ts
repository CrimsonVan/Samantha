import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // 启用 Babel 转译
      babel: {
        plugins: ['react-activation/babel']
      }
    })
  ],
  server: {
    // 开发服务器配置
    port: 5173, // 前端开发服务器端口（默认）
    open: true, // 自动打开浏览器
    proxy: {
      // 配置代理：将所有以 /api/dashscope 开头的请求转发到通义千问
      '/api/dashscope': {
        target: 'https://dashscope.aliyuncs.com', // 目标服务器地址
        changeOrigin: true, // 重要：修改请求头中的 Origin
        rewrite: (path) => path.replace(/^\/api\/dashscope/, ''), // 移除前缀
        // 可选：配置请求日志（用于调试）
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('[Proxy] 转发请求:', req.method, req.url, '→', options.target + req.url)
          })
          proxy.on('error', (err, req, res) => {
            console.error('[Proxy] 代理错误:', err.message)
          })
        }
      }
    }
  }
})
