import { http, HttpResponse } from 'msw'

import { footerSnapshotMock } from '@/mocks/data/footer'

export const footerHandlers = [
  http.get('/api/footer', () => {
    return HttpResponse.json(
      {
        success: true,
        data: footerSnapshotMock,
      },
      { status: 200 },
    )
  }),
]