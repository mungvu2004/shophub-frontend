import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Providers } from '@/app/providers'
import './index.css'
import App from './App.tsx'

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  const { worker } = await import('@/mocks/browser')
  await worker.start({
    onUnhandledRequest(request) {
      const url = new URL(request.url)
      
      // DANH SÁCH CÁC TIỀN TỐ API
      if (url.pathname.startsWith('/api/')) {
        // Nếu là API mà thiếu handler, cảnh báo để debug
        return 'warn'
      }

      // TẤT CẢ CÁC REQUEST KHÔNG PHẢI /api/ THÌ BỎ QUA (BYPASS)
      // Điều này ngăn chặn triệt để lỗi Failed to fetch cho HMR, assets, v.v.
      return 'bypass'
    },
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
    quiet: true,
  })
}

async function bootstrap() {
  await enableMocking()

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers>
        <App />
      </Providers>
    </StrictMode>,
  )
}

void bootstrap()
