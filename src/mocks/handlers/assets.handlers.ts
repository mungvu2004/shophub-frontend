import { http, HttpResponse } from 'msw'

const svgPlaceholder = (label: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="12" fill="#e2e8f0" />
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#475569">${label}</text>
</svg>
`

/**
 * Assets Handlers
 * CHỈ dùng để giả lập các hình ảnh từ bên ngoài nếu cần thiết.
 * KHÔNG can thiệp vào local assets (/src/assets) hoặc các tài nguyên hệ thống.
 */
export const assetsHandlers = [
  // Placeholder service fallback
  http.get('https://via.placeholder.com/*', ({ request }) => {
    const url = new URL(request.url)
    const text = url.searchParams.get('text') ?? 'Image'

    return new HttpResponse(svgPlaceholder(text), {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  }),

  // Unsplash fallback for mock data
  http.get('https://images.unsplash.com/*', () => {
    return new HttpResponse(svgPlaceholder('Unsplash'), {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  }),
]
