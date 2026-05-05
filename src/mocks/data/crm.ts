import type {
  CRMReplyTemplate,
  CRMReviewInboxSummary,
  CRMReviewItem,
  CRMReviewSentiment,
  CRMWeeklyInsight,
} from '@/types/crm.types'
import { mockProducts } from './products'

const vietnameseNames = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Phạm Minh C',
  'Hoàng Gia D',
  'Võ Hữu E',
  'Tô Bích F',
  'Dương Nam G',
  'Nông Hoa H',
  'Lý Sơn I',
  'Vương Linh J',
  'Bùi Tuấn K',
  'Trương Lan L',
  'Lê Hùng M',
  'Đinh Hạo N',
  'Phan Yến O',
];

const positiveComments = [
  'Sản phẩm đúng mô tả, chất lượng tốt!',
  'Giao hàng nhanh, đóng gói kỹ lưỡng.',
  'Rất hài lòng với sản phẩm này. Sẽ mua tiếp!',
  'Chất liệu đẹp, mặc rất thoải mái.',
  'Giá cả hợp lý so với chất lượng.',
  'Shop phục vụ tốt, giao hàng nhanh chóng.',
  'Sẽ giới thiệu cho bạn bè!',
  'Sản phẩm bền, rất đáng mua.',
  'Mặc lên trông gọn gàng, rất hài lòng!',
  'Vải mềm mại, không làm ngứa da.',
  'Màu sắc giống ảnh quảng cáo, tuyệt!',
  'Giao nhanh, đóng gói cẩn thận.',
  'Giá rẻ mà chất lượng tốt, rất đáng.',
  'Shop nhanh nhẹn, trả lời tin nhắn ngay.',
  'Đã mua lần 3, rất ưng ý sản phẩm này.',
  'Chất cotton tự nhiên, mặc rất mát.',
  'May đo tỉ mỉ, không có điểm lỗi nào.',
  'Khâu chắc chắn, không lo sẽ tụt chỉ.',
  'Mua cho cả gia đình, ai cũng thích!',
  'Trị giá tiền, sẽ quay lại mua tiếp.',
];

const negativeComments = [
  'Vải mỏng hơn kỳ vọng, thất vọng.',
  'Size không đúng như mô tả.',
  'Giao hàng chậm, chưa có phản hồi từ shop.',
  'Màu sắc khác với ảnh quảng cáo.',
  'Chất lượng không tốt, dễ bị xỉn màu.',
  'Khâu không chắc chắn, dễ tụt chỉ.',
  'Shop phục vụ chậm, không phản hồi tin nhắn.',
  'Sản phẩm có lỗi từ khi gửi đến.',
  'Form quá rộng, mặc như váy.',
  'Bó sát quá mức, khó chịu.',
  'Hàng không như ảnh, hơi hụi.',
  'Giao lâu hơn thời gian hứa hẹn.',
  'Nhân viên shop tỏ thái độ không vui.',
  'Sản phẩm bị lỏng chỉ, cần may lại.',
  'Xịn giặt lần đầu là phai màu.',
  'Bo cổ bị cứng, khó chịu.',
  'Mua không đúng dịp, giao chậm cả tuần.',
  'Chất lượng kém, không đáng giá.',
  'Nút bị tuột sau vài lần mặc.',
  'Hình ảnh quảng cáo khác hàng thực tế.',
];

const neutralComments = [
  'Sản phẩm bình thường, có thể tốt hơn.',
  'Cần cập nhật bảng size chi tiết hơn.',
  'Giao hàng ổn, nhưng chất lượng có thể tốt hơn.',
  'Có thể dùng được nhưng không thật tuyệt vời.',
  'Giá hơi cao so với chất lượng.',
  'Hình ảnh sản phẩm không rõ lắm.',
  'Muốn có nhiều màu sắc hơn.',
  'Ok, nhưng chưa quá xuất sắc.',
  'Bình thường, không có gì đặc biệt.',
  'May ổn, nhưng vải chưa thật cao cấp.',
  'Mặc ổn nhưng nên có hướng dẫn bảo quản.',
  'Giao hàng bình thường, không nhanh lắm.',
  'Giá tạm ổn, nhưng shop khác rẻ hơn.',
  'Sản phẩm dùng được, kỳ vọng cao hơn.',
  'Không có lỗi nhưng cũng không xuất sắc.',
  'May tạm được, nhưng vải chưa mềm lắm.',
  'Ok trong tầm giá, chấp nhận được.',
];


const negativeTopics = [
  ['Kích thước', 'Chất liệu'],
  ['Màu sắc', 'Vận chuyển'],
  ['Chất lượng', 'Khâu'],
  ['Tốc độ phản hồi', 'Vận chuyển'],
  ['Chất liệu', 'Độ bền'],
];

const positiveTopics = [
  ['Giao hàng', 'Chất lượng'],
  ['Chất lượng', 'Giá cả'],
  ['Đóng gói', 'Chất lượng'],
  ['Giao hàng', 'Phục vụ'],
  ['Chất liệu', 'Kích thước'],
];

const neutralTopics = [
  ['Thông tin size', 'Mô tả sản phẩm'],
  ['Giá cả', 'Chất lượng'],
  ['Lựa chọn màu', 'Kích thước'],
  ['Mô tả sản phẩm', 'Hình ảnh'],
];

/**
 * Generate 150 reviews with realistic distribution:
 * - 70% positive (105 reviews)
 * - 15% neutral (23 reviews)
 * - 15% negative (22 reviews)
 */
export const crmReviewInboxMock: CRMReviewItem[] = Array.from({ length: 150 }, (_, idx) => {
  const n = idx + 1;
  const product = mockProducts[n % mockProducts.length];
  const DAY_IN_MS = 24 * 60 * 60 * 1000;
  const baseDate = new Date('2026-05-05T00:00:00Z');
  
  // Spread reviews over 60 days (2 months)
  const createdAt = new Date(baseDate.getTime() - ((n % 60) * DAY_IN_MS));
  
  // Deterministic sentiment distribution
  let sentimentType: CRMReviewSentiment;
  let rating: number;
  
  if (n % 100 < 70) {
    // 70% positive
    sentimentType = 'positive';
    rating = n % 5 === 0 ? 5 : 4;
  } else if (n % 100 < 85) {
    // 15% neutral
    sentimentType = 'neutral';
    rating = 3;
  } else {
    // 15% negative
    sentimentType = 'negative';
    rating = n % 3 === 0 ? 2 : 1;
  }
  
  let comment = '';
  let topics: string[] = [];
  let confidence = 0;
  
  if (sentimentType === 'negative') {
    comment = negativeComments[n % negativeComments.length];
    topics = negativeTopics[n % negativeTopics.length];
    confidence = 70 + (n % 25);
  } else if (sentimentType === 'positive') {
    comment = positiveComments[n % positiveComments.length];
    topics = positiveTopics[n % positiveTopics.length];
    confidence = 90 + (n % 10);
  } else {
    comment = neutralComments[n % neutralComments.length];
    topics = neutralTopics[n % neutralTopics.length];
    confidence = 65 + (n % 25);
  }
  
  // Reply rate: 60% of positive/neutral, 80% of negative
  const isReplied = sentimentType === 'negative' ? (n % 5 !== 0) : (n % 5 < 3);
  const isPriority = sentimentType === 'negative' || (sentimentType === 'neutral' && n % 7 === 0);
  
  return {
    id: `crv-${String(1000 + n).padStart(4, "0")}`,
    platform: (['shopee', 'tiktok_shop', 'lazada'] as const)[n % 3],
    rating,
    productId: product.id,
    productName: product.name,
    customerName: vietnameseNames[n % vietnameseNames.length],
    customerMaskedPhone: '***',
    comment,
    createdAt: createdAt.toISOString(),
    isPriority,
    isReplied,
    isRead: n % 3 === 0,
    ai: {
      sentiment: sentimentType,
      confidence,
      topics,
    },
    ...(isReplied && {
      reply: {
        id: `reply-${String(2000 + n).padStart(4, "0")}`,
        tone: sentimentType === 'negative' ? 'important' : 'friendly',
        content: sentimentType === 'negative' 
          ? 'Chào bạn, shop xin lỗi vì trải nghiệm chưa như ý. Shop sẽ cải thiện hơn. Vui lòng liên hệ shop để hỗ trợ đổi trả!'
          : (sentimentType === 'positive' 
            ? `Cảm ơn bạn đã ủng hộ! Shop rất vui và mong tiếp tục phục vụ bạn!`
            : 'Cảm ơn bạn đã góp ý. Shop sẽ xem xét cập nhật sớm nhất!'),
        isDraft: false,
        createdAt: new Date(createdAt.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      },
    }),
  };
});

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
