import { http, HttpResponse } from 'msw'

const svgPlaceholder = (label: string) => `
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <rect width="120" height="120" rx="12" fill="#e2e8f0" />
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#475569">${label}</text>
</svg>
`

export const assetsHandlers = [
  http.get(/https:\/\/via\.placeholder\.com\/.*/, ({ request }) => {
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

  http.get(/https:\/\/images\.unsplash\.com\/.*/, () => {
    return new HttpResponse(svgPlaceholder('Unsplash'), {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  }),

  // Fallback only for external static assets (not localhost app/api requests).
  http.get(/https?:\/\/.*/, ({ request }) => {
    const url = new URL(request.url)
    const isLocalOrigin =
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname === '[::1]'

    if (isLocalOrigin) {
      return undefined
    }

    const destination = request.destination
    const accept = request.headers.get('accept') ?? ''

    if (destination === 'image' || accept.includes('image/')) {
      return new HttpResponse(svgPlaceholder('Image'), {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': 'public, max-age=120',
        },
      })
    }

    if (destination === 'style' || accept.includes('text/css')) {
      return new HttpResponse('', {
        status: 200,
        headers: {
          'Content-Type': 'text/css; charset=utf-8',
          'Cache-Control': 'public, max-age=120',
        },
      })
    }

    if (destination === 'font' || accept.includes('font/')) {
      return new HttpResponse(null, {
        status: 204,
        headers: {
          'Cache-Control': 'public, max-age=120',
        },
      })
    }

    return undefined
  }),
]
