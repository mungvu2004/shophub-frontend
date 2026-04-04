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
    onUnhandledRequest: (request, print) => {
      const url = new URL(request.url)
      if (url.pathname.startsWith('/api/')) {
        print.warning()
      }
    },
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
