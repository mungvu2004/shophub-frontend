import type {
  CRMReplyTemplate,
  CRMReviewInboxSummary,
  CRMReviewItem,
  CRMReviewSentiment,
  CRMWeeklyInsight,
} from '@/types/crm.types'

export const crmReviewInboxMock: CRMReviewItem[] = [
  {
    id: 'crv-1001',
    platform: 'shopee',
    rating: 1,
    productName: 'Áo thun basic L',
    customerName: 'Nguyễn Văn A',
    customerMaskedPhone: '***',
    comment:
      'Vải quá mỏng, size L mặc như M. Thất vọng. Shop phục vụ không tốt, nhắn tin không ai rep.',
    createdAt: '2026-03-31T08:10:00.000Z',
    isPriority: true,
    isReplied: false,
    isRead: false,
    ai: {
      sentiment: 'negative',
      confidence: 94,
      topics: ['Kích thước', 'Chất liệu'],
    },
  },
  {
    id: 'crv-1002',
    platform: 'tiktok',
    rating: 5,
    productName: 'Váy hoa nhí M',
    customerName: 'Lê Thị B',
    customerMaskedPhone: '***',
    comment:
      'Váy đẹp, giao nhanh, đóng gói kỹ. 5 sao! Sẽ ủng hộ shop thêm nhiều lần nữa nhen.',
    createdAt: '2026-03-30T07:20:00.000Z',
    isPriority: false,
    isReplied: true,
    isRead: true,
    ai: {
      sentiment: 'positive',
      confidence: 97,
      topics: ['Giao hàng', 'Chất lượng'],
    },
    reply: {
      id: 'reply-2001',
      tone: 'friendly',
      content: 'Cảm ơn bạn đã ủng hộ. Shop rất vui và mong tiếp tục phục vụ bạn!',
      isDraft: false,
      createdAt: '2026-03-30T08:00:00.000Z',
    },
  },
  {
    id: 'crv-1003',
    platform: 'lazada',
    rating: 2,
    productName: 'Áo khoác gió M',
    customerName: 'Trần Minh C',
    customerMaskedPhone: '***',
    comment:
      'Áo đẹp nhưng giao hàng hơi lâu, shop tư vấn hơi chậm nên mình hơi mệt.',
    createdAt: '2026-03-29T11:40:00.000Z',
    isPriority: false,
    isReplied: false,
    isRead: true,
    ai: {
      sentiment: 'negative',
      confidence: 71,
      topics: ['Tốc độ phản hồi', 'Vận chuyển'],
    },
  },
  {
    id: 'crv-1004',
    platform: 'shopee',
    rating: 4,
    productName: 'Quần jean suông S',
    customerName: 'Phạm Gia D',
    customerMaskedPhone: '***',
    comment:
      'Quần đẹp và đúng mô tả, nhưng mình vẫn muốn shop gửi bảng size chi tiết hơn.',
    createdAt: '2026-03-28T10:00:00.000Z',
    isPriority: false,
    isReplied: false,
    isRead: true,
    ai: {
      sentiment: 'neutral',
      confidence: 68,
      topics: ['Thông tin size'],
    },
  },
]

export const crmReplyTemplatesBySentiment: Record<CRMReviewSentiment, CRMReplyTemplate[]> = {
  negative: [
    {
      id: 'tpl-important-1',
      tone: 'important',
      title: 'TRANG TRỌNG',
      content:
        'Chào bạn, shop rất tiếc vì trải nghiệm chưa như mong đợi. Shop xin ghi nhận và hỗ trợ đổi trả ngay nếu bạn cần. Mong bạn thông cảm cho shop.',
    },
    {
      id: 'tpl-friendly-1',
      tone: 'friendly',
      title: 'THÂN THIỆN',
      content:
        'Ơi shop xin lỗi mình nhiều vì trải nghiệm chưa tốt. Nếu bạn đồng ý, mình gửi voucher giảm 20% và hỗ trợ đổi size ngay hôm nay nhé.',
    },
  ],
  neutral: [
    {
      id: 'tpl-important-2',
      tone: 'important',
      title: 'TRANG TRỌNG',
      content:
        'Cảm ơn bạn đã đánh giá. Shop đã cập nhật bảng size chi tiết hơn để mình dễ chọn trong lần mua tới.',
    },
    {
      id: 'tpl-friendly-2',
      tone: 'friendly',
      title: 'THÂN THIỆN',
      content:
        'Cảm ơn mình đã góp ý. Tuần này shop sẽ bổ sung hướng dẫn size đầy đủ hơn để mình mua dễ hơn nhé.',
    },
  ],
  positive: [
    {
      id: 'tpl-important-3',
      tone: 'important',
      title: 'TRANG TRỌNG',
      content: 'Cảm ơn bạn đã đánh giá cao. Shop rất trân trọng sự tin tưởng của bạn.',
    },
    {
      id: 'tpl-friendly-3',
      tone: 'friendly',
      title: 'THÂN THIỆN',
      content: 'Yêu quá, cảm ơn mình nhiều. Shop hẹn gặp lại mình ở đơn tiếp theo nhé!',
    },
  ],
}

export const crmWeeklyInsightMock: CRMWeeklyInsight = {
  id: 'insight-week-1',
  title: 'INSIGHT TUẦN NÀY',
  description:
    'Phản hồi tiêu cực tăng 12% liên quan đến kích thước. Nên cập nhật bảng size chi tiết cho danh mục thời trang.',
  ctaLabel: 'XEM BÁO CÁO CHI TIẾT',
}

export function buildCRMReviewSummary(items: CRMReviewItem[]): CRMReviewInboxSummary {
  const totalCount = items.length
  const repliedCount = items.filter((item) => item.isReplied).length
  const unrepliedCount = Math.max(totalCount - repliedCount, 0)
  const negativeCount = items.filter((item) => item.ai.sentiment === 'negative').length

  const replyRatePercent = totalCount > 0 ? Math.round((repliedCount / totalCount) * 100) : 0

  const repliedItems = items.filter((item) => item.isReplied && item.reply)
  const avgReplyHours = repliedItems.length
    ? Math.round(
        repliedItems.reduce((acc, item) => {
          if (!item.reply) return acc
          const createdMs = new Date(item.createdAt).getTime()
          const repliedMs = new Date(item.reply.createdAt).getTime()
          const hours = Math.max((repliedMs - createdMs) / (1000 * 60 * 60), 0)
          return acc + hours
        }, 0) / repliedItems.length,
      )
    : 0

  const trustScore = Number((4.2 + replyRatePercent / 100).toFixed(1))

  return {
    replyRatePercent,
    avgReplyHours,
    trustScore,
    totalCount,
    unrepliedCount,
    negativeCount,
    repliedCount,
  }
}
