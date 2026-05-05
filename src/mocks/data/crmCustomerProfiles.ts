import type {
  CRMCustomerProfileDetail,
  CRMCustomerProfileListItem,
  CRMCustomerProfilesResponse,
  CRMCustomerProfilesSummary,
} from '@/types/crm.types'

const customerProfiles: CRMCustomerProfileDetail[] = [
  {
    id: 'cust-001',
    customerCode: 'KH-001',
    fullName: 'Trần Văn A',
    maskedPhone: '0912***456',
    email: 'a.tran***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-001',
    customerSinceLabel: '15/03/2025',
    segment: { id: 'vip_gold', label: 'VIP Gold', tone: 'vip_gold' },
    platformLabels: [
      { id: 'shopee', label: 'Shopee', tone: 'shopee' },
      { id: 'lazada', label: 'Lazada', tone: 'lazada' },
    ],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 6,
      totalSpend: 1284000,
      lastOrderLabel: '5 ngày trước',
      averageOrderValue: 214000,
    },
    lifecycle: [
      { dateLabel: '15/03/2025', title: 'Đơn đầu tiên' },
      { dateLabel: '20/03/2025', title: 'Mua lại' },
      { dateLabel: '01/05/2025', title: 'Khách trung thành' },
      { dateLabel: 'Hôm nay', title: 'VIP', isCurrent: true },
    ],
    orders: [
      {
        id: 'ord-002',
        orderCode: 'SHOPEE-1002',
        dateLabel: '05/05/2026',
        productName: 'Áo thun basic (x2)',
        platform: 'shopee',
        amount: 250000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
      {
        id: 'ord-005',
        orderCode: 'SHOPEE-1005',
        dateLabel: '01/05/2026',
        productName: 'Quần jean slim',
        platform: 'lazada',
        amount: 350000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-001',
        content: 'Khách thích mua theo combo, gửi thông tin bundle mới. Ưu tiên contact.',
        createdAtLabel: 'bởi SUPPORT - 05/05/2026',
        authorLabel: 'SUPPORT',
      },
    ],
    reviews: [
      {
        id: 'review-001',
        sourceLabel: 'Shopee',
        rating: 5,
        content: 'Vải đẹp, giao hàng nhanh, shop tư vấn nhiệt tình!',
        productName: 'Áo thun basic',
        sentimentLabel: 'Positive',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '9/10', progressPercent: 90 },
      { label: 'FREQUENCY', value: '8/10', progressPercent: 85 },
      { label: 'MONETARY', value: '7/10', progressPercent: 72 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 88%',
      description: 'Khách hoạt động tích cực, tần suất mua tăng, tiềm năng chuyển đổi cao.',
      favoriteProductLabel: 'Áo (72%)',
      favoriteChannelLabel: 'Shopee (67%)',
      churnRiskLabel: 'Low (5%)',
      churnRiskPercent: 5,
    },
  },
  {
    id: 'cust-002',
    customerCode: 'KH-002',
    fullName: 'Phạm Minh C',
    maskedPhone: '0983***112',
    email: 'c.pham***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-002',
    customerSinceLabel: '20/02/2025',
    segment: { id: 'regular_blue', label: 'Regular Blue', tone: 'regular_blue' },
    platformLabels: [{ id: 'tiktok_shop', label: 'TikTok Shop', tone: 'tiktok' }],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 3,
      totalSpend: 720000,
      lastOrderLabel: '10 ngày trước',
      averageOrderValue: 240000,
    },
    lifecycle: [
      { dateLabel: '20/02/2025', title: 'TikTok lần đầu' },
      { dateLabel: '15/03/2025', title: 'Mua lại' },
      { dateLabel: '01/05/2025', title: 'Ổn định' },
      { dateLabel: 'Hôm nay', title: 'Regular', isCurrent: true },
    ],
    orders: [
      {
        id: 'ord-003',
        orderCode: 'TIKTOK_SHOP-1003',
        dateLabel: '25/04/2026',
        productName: 'Váy xòe đuôi cá',
        platform: 'tiktok_shop',
        amount: 380000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-101',
        content: 'Khách mua hàng theo trend TikTok, ưa thích các sản phẩm nữ tính.',
        createdAtLabel: 'bởi MARKETING - 26/04/2026',
        authorLabel: 'MARKETING',
      },
    ],
    reviews: [
      {
        id: 'review-101',
        sourceLabel: 'TikTok',
        rating: 4,
        content: 'Váy đẹp nhưng kỹ thuật đo size cần cải thiện.',
        productName: 'Váy xòe đuôi cá',
        sentimentLabel: 'Neutral',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '7/10', progressPercent: 70 },
      { label: 'FREQUENCY', value: '5/10', progressPercent: 55 },
      { label: 'MONETARY', value: '6/10', progressPercent: 62 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 82%',
      description: 'Khách theo trend, mua sắm theo mùa. Nên gửi sản phẩm bán chạy tuần lệ.',
      favoriteProductLabel: 'Váy (78%)',
      favoriteChannelLabel: 'TikTok (92%)',
      churnRiskLabel: 'Medium (18%)',
      churnRiskPercent: 18,
    },
  },
  {
    id: 'cust-003',
    customerCode: 'KH-003',
    fullName: 'Hoàng Gia D',
    maskedPhone: '0345***889',
    email: 'd.hoang***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-003',
    customerSinceLabel: '10/04/2025',
    segment: { id: 'at_risk_red', label: 'At Risk Red', tone: 'at_risk_red' },
    platformLabels: [{ id: 'lazada', label: 'Lazada', tone: 'lazada' }],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 2,
      totalSpend: 450000,
      lastOrderLabel: '35 ngày trước',
      averageOrderValue: 225000,
    },
    lifecycle: [
      { dateLabel: '10/04/2025', title: 'Mua lần đầu' },
      { dateLabel: '25/04/2025', title: 'Mua lại' },
      { dateLabel: 'Hôm nay', title: 'Cần kích hoạt', isCurrent: true },
    ],
    orders: [
      {
        id: 'ord-001',
        orderCode: 'LAZADA-1001',
        dateLabel: '01/04/2026',
        productName: 'Áo khoác gió',
        platform: 'lazada',
        amount: 450000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-201',
        content: 'Khách nhạy cảm với phí ship, nên tặng freeship voucher khi kích hoạt.',
        createdAtLabel: 'bởi SALES - 02/05/2026',
        authorLabel: 'SALES',
      },
    ],
    reviews: [],
    rfm: [
      { label: 'RECENCY', value: '3/10', progressPercent: 30 },
      { label: 'FREQUENCY', value: '2/10', progressPercent: 20 },
      { label: 'MONETARY', value: '4/10', progressPercent: 42 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 81%',
      description: 'Khách nguy cơ cao rời bỏ. Nên gọi điện hoặc gửi ưu đãi đặc biệt ngay.',
      favoriteProductLabel: 'Áo khoác (81%)',
      favoriteChannelLabel: 'Lazada (94%)',
      churnRiskLabel: 'High (54%)',
      churnRiskPercent: 54,
    },
  },
  {
    id: 'cust-004',
    customerCode: 'KH-004',
    fullName: 'Võ Hữu E',
    maskedPhone: '0967***234',
    email: 'e.vo***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-004',
    customerSinceLabel: '12/01/2025',
    segment: { id: 'vip_gold', label: 'VIP Gold', tone: 'vip_gold' },
    platformLabels: [
      { id: 'shopee', label: 'Shopee', tone: 'shopee' },
      { id: 'tiktok_shop', label: 'TikTok Shop', tone: 'tiktok' },
      { id: 'lazada', label: 'Lazada', tone: 'lazada' },
    ],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 8,
      totalSpend: 1890000,
      lastOrderLabel: '2 ngày trước',
      averageOrderValue: 236250,
    },
    lifecycle: [
      { dateLabel: '12/01/2025', title: 'Đơn đầu tiên' },
      { dateLabel: '25/01/2025', title: 'Early VIP' },
      { dateLabel: '01/03/2025', title: 'VIP status' },
      { dateLabel: 'Hôm nay', title: 'Top VIP', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-301',
        orderCode: 'SPE-001005',
        dateLabel: '03/05/2026',
        productName: 'Áo thun + Quần (combo)',
        platform: 'shopee',
        amount: 420000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
      {
        id: 'order-302',
        orderCode: 'LAZ-001006',
        dateLabel: '28/04/2026',
        productName: 'Phụ kiện (Belt + Scarf)',
        platform: 'lazada',
        amount: 280000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-301',
        content: 'Khách VIP, ưu tiên gọi điện mở mẻ sản phẩm mới trước release.',
        createdAtLabel: 'bởi BUSINESS - 04/05/2026',
        authorLabel: 'BUSINESS',
      },
    ],
    reviews: [
      {
        id: 'review-301',
        sourceLabel: 'Shopee',
        rating: 5,
        content: 'Luôn hài lòng, shop tư vấn chuyên nghiệp, giá tốt!',
        productName: 'Áo thun',
        sentimentLabel: 'Positive',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '10/10', progressPercent: 100 },
      { label: 'FREQUENCY', value: '9/10', progressPercent: 92 },
      { label: 'MONETARY', value: '8/10', progressPercent: 85 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 95%',
      description: 'Khách trung thành tối cao. Nên bảo lưu cho VIP event, tặng quà đặc biệt.',
      favoriteProductLabel: 'Combo (55%)',
      favoriteChannelLabel: 'Shopee (65%)',
      churnRiskLabel: 'Very Low (2%)',
      churnRiskPercent: 2,
    },
  },
  {
    id: 'cust-005',
    customerCode: 'KH-005',
    fullName: 'Tô Bích F',
    maskedPhone: '0912***567',
    email: 'f.to***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-005',
    customerSinceLabel: '08/03/2025',
    segment: { id: 'regular_blue', label: 'Regular Blue', tone: 'regular_blue' },
    platformLabels: [{ id: 'tiktok_shop', label: 'TikTok Shop', tone: 'tiktok' }],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 4,
      totalSpend: 980000,
      lastOrderLabel: '8 ngày trước',
      averageOrderValue: 245000,
    },
    lifecycle: [
      { dateLabel: '08/03/2025', title: 'TikTok lần đầu' },
      { dateLabel: '22/03/2025', title: 'Mua lại' },
      { dateLabel: '15/04/2025', title: 'Regular' },
      { dateLabel: 'Hôm nay', title: 'Active regular', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-401',
        orderCode: 'TIK-001007',
        dateLabel: '27/04/2026',
        productName: 'Phụ kiện thời trang',
        platform: 'tiktok_shop',
        amount: 280000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-401',
        content: 'Khách active TikTok, nên target với TikTok ad hơn email.',
        createdAtLabel: 'bởi MARKETING - 28/04/2026',
        authorLabel: 'MARKETING',
      },
    ],
    reviews: [
      {
        id: 'review-401',
        sourceLabel: 'TikTok',
        rating: 4,
        content: 'Chất lượng tốt, giao hàng ok, sẽ mua tiếp!',
        productName: 'Phụ kiện',
        sentimentLabel: 'Positive',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '8/10', progressPercent: 80 },
      { label: 'FREQUENCY', value: '7/10', progressPercent: 70 },
      { label: 'MONETARY', value: '6/10', progressPercent: 65 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 85%',
      description: 'Khách mua vừa phải, có tiềm năng nâng cấp. Cân nhắc gửi upgrade offer.',
      favoriteProductLabel: 'Phụ kiện (68%)',
      favoriteChannelLabel: 'TikTok (100%)',
      churnRiskLabel: 'Low (12%)',
      churnRiskPercent: 12,
    },
  },
  {
    id: 'cust-006',
    customerCode: 'KH-006',
    fullName: 'Dương Nam G',
    maskedPhone: '0888***901',
    email: 'g.duong***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-006',
    customerSinceLabel: '25/02/2025',
    segment: { id: 'regular_blue', label: 'New Green', tone: 'regular_blue' },
    platformLabels: [{ id: 'lazada', label: 'Lazada', tone: 'lazada' }],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 1,
      totalSpend: 280000,
      lastOrderLabel: '20 ngày trước',
      averageOrderValue: 280000,
    },
    lifecycle: [
      { dateLabel: '25/02/2025', title: 'Khách mới' },
      { dateLabel: 'Hôm nay', title: 'Theo dõi', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-501',
        orderCode: 'LAZ-001008',
        dateLabel: '15/04/2026',
        productName: 'Áo thun basic',
        platform: 'lazada',
        amount: 280000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-501',
        content: 'Khách mới, gửi welcome voucher để kích hoạt mua lần 2.',
        createdAtLabel: 'bởi CRM - 16/04/2026',
        authorLabel: 'CRM',
      },
    ],
    reviews: [],
    rfm: [
      { label: 'RECENCY', value: '5/10', progressPercent: 50 },
      { label: 'FREQUENCY', value: '1/10', progressPercent: 10 },
      { label: 'MONETARY', value: '3/10', progressPercent: 28 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 72%',
      description: 'Khách mới. Cần theo dõi và khuyến khích mua lần 2 trong 30 ngày.',
      favoriteProductLabel: 'Áo (100%)',
      favoriteChannelLabel: 'Lazada (92%)',
      churnRiskLabel: 'Medium (35%)',
      churnRiskPercent: 35,
    },
  },
  {
    id: 'cust-007',
    customerCode: 'KH-007',
    fullName: 'Nông Hoa H',
    maskedPhone: '0756***345',
    email: 'h.nong***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-007',
    customerSinceLabel: '01/02/2025',
    segment: { id: 'regular_blue', label: 'Regular Blue', tone: 'regular_blue' },
    platformLabels: [
      { id: 'shopee', label: 'Shopee', tone: 'shopee' },
      { id: 'lazada', label: 'Lazada', tone: 'lazada' },
    ],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 5,
      totalSpend: 1050000,
      lastOrderLabel: '15 ngày trước',
      averageOrderValue: 210000,
    },
    lifecycle: [
      { dateLabel: '01/02/2025', title: 'Shopee lần đầu' },
      { dateLabel: '15/02/2025', title: 'Mua Lazada' },
      { dateLabel: '01/04/2025', title: 'Ổn định' },
      { dateLabel: 'Hôm nay', title: 'Regular', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-601',
        orderCode: 'SPE-001009',
        dateLabel: '20/04/2026',
        productName: 'Áo thun (x3)',
        platform: 'shopee',
        amount: 420000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-601',
        content: 'Khách thích mua bulk, nên gửi discount buy more.',
        createdAtLabel: 'bởi SALES - 21/04/2026',
        authorLabel: 'SALES',
      },
    ],
    reviews: [
      {
        id: 'review-601',
        sourceLabel: 'Shopee',
        rating: 4,
        content: 'Chất lượng ổn, giá tạm được, sẽ mua tiếp.',
        productName: 'Áo thun',
        sentimentLabel: 'Neutral',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '7/10', progressPercent: 72 },
      { label: 'FREQUENCY', value: '6/10', progressPercent: 62 },
      { label: 'MONETARY', value: '6/10', progressPercent: 60 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 80%',
      description: 'Khách mua bulk, có thể quan tâm đến wholesale hoặc partner program.',
      favoriteProductLabel: 'Áo (85%)',
      favoriteChannelLabel: 'Shopee (72%)',
      churnRiskLabel: 'Low (10%)',
      churnRiskPercent: 10,
    },
  },
  {
    id: 'cust-008',
    customerCode: 'KH-008',
    fullName: 'Lý Sơn I',
    maskedPhone: '0679***678',
    email: 'i.ly***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-008',
    customerSinceLabel: '14/03/2025',
    segment: { id: 'regular_blue', label: 'Regular Blue', tone: 'regular_blue' },
    platformLabels: [{ id: 'tiktok_shop', label: 'TikTok Shop', tone: 'tiktok' }],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 3,
      totalSpend: 750000,
      lastOrderLabel: '12 ngày trước',
      averageOrderValue: 250000,
    },
    lifecycle: [
      { dateLabel: '14/03/2025', title: 'TikTok lần đầu' },
      { dateLabel: '28/03/2025', title: 'Mua lại' },
      { dateLabel: '01/05/2025', title: 'Regular' },
      { dateLabel: 'Hôm nay', title: 'Active', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-701',
        orderCode: 'TIK-001010',
        dateLabel: '23/04/2026',
        productName: 'Giày & Phụ kiện',
        platform: 'tiktok_shop',
        amount: 380000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-701',
        content: 'Khách quan tâm giày, nên prioritize giày hàng mới.',
        createdAtLabel: 'bởi PRODUCT - 24/04/2026',
        authorLabel: 'PRODUCT',
      },
    ],
    reviews: [
      {
        id: 'review-701',
        sourceLabel: 'TikTok',
        rating: 5,
        content: 'Giày đẹp, giao nhanh, 5 sao!',
        productName: 'Giày',
        sentimentLabel: 'Positive',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '8/10', progressPercent: 82 },
      { label: 'FREQUENCY', value: '5/10', progressPercent: 52 },
      { label: 'MONETARY', value: '6/10', progressPercent: 63 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 83%',
      description: 'Khách thích giày & phụ kiện. Ưu tiên gửi flash sale category này.',
      favoriteProductLabel: 'Giày (75%)',
      favoriteChannelLabel: 'TikTok (98%)',
      churnRiskLabel: 'Low (14%)',
      churnRiskPercent: 14,
    },
  },
  {
    id: 'cust-009',
    customerCode: 'KH-009',
    fullName: 'Vương Linh J',
    maskedPhone: '0645***012',
    email: 'j.vuong***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-009',
    customerSinceLabel: '17/01/2025',
    segment: { id: 'vip_gold', label: 'VIP Silver', tone: 'vip_gold' },
    platformLabels: [
      { id: 'shopee', label: 'Shopee', tone: 'shopee' },
      { id: 'lazada', label: 'Lazada', tone: 'lazada' },
    ],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 7,
      totalSpend: 1680000,
      lastOrderLabel: '4 ngày trước',
      averageOrderValue: 240000,
    },
    lifecycle: [
      { dateLabel: '17/01/2025', title: 'Đơn đầu tiên' },
      { dateLabel: '02/02/2025', title: 'Mua lại' },
      { dateLabel: '15/03/2025', title: 'VIP Silver' },
      { dateLabel: 'Hôm nay', title: 'VIP Silver', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-801',
        orderCode: 'SPE-001011',
        dateLabel: '01/05/2026',
        productName: 'Áo + Quần combo',
        platform: 'shopee',
        amount: 450000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-801',
        content: 'Khách VIP Silver, ưu tiên gửi pre-launch sản phẩm mới.',
        createdAtLabel: 'bởi VIP TEAM - 02/05/2026',
        authorLabel: 'VIP TEAM',
      },
    ],
    reviews: [
      {
        id: 'review-801',
        sourceLabel: 'Shopee',
        rating: 5,
        content: 'Luôn hài lòng. Shop phục vụ tốt, đáng lắm!',
        productName: 'Combo',
        sentimentLabel: 'Positive',
      },
    ],
    rfm: [
      { label: 'RECENCY', value: '9/10', progressPercent: 94 },
      { label: 'FREQUENCY', value: '8/10', progressPercent: 80 },
      { label: 'MONETARY', value: '7/10', progressPercent: 78 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 91%',
      description: 'Khách trung thành, tần suất mua cao. Có tiềm năng nâng lên VIP Gold.',
      favoriteProductLabel: 'Combo (62%)',
      favoriteChannelLabel: 'Shopee (68%)',
      churnRiskLabel: 'Very Low (4%)',
      churnRiskPercent: 4,
    },
  },
  {
    id: 'cust-010',
    customerCode: 'KH-010',
    fullName: 'Bùi Tuấn K',
    maskedPhone: '0834***345',
    email: 'k.bui***@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=customer-010',
    customerSinceLabel: '22/04/2025',
    segment: { id: 'at_risk_red', label: 'New Green', tone: 'at_risk_red' },
    platformLabels: [{ id: 'lazada', label: 'Lazada', tone: 'lazada' }],
    primaryCtaLabel: 'Gửi voucher cá nhân hóa',
    secondaryCtaLabel: 'Chỉnh sửa',
    stats: {
      totalOrders: 1,
      totalSpend: 320000,
      lastOrderLabel: '15 ngày trước',
      averageOrderValue: 320000,
    },
    lifecycle: [
      { dateLabel: '22/04/2025', title: 'Khách mới' },
      { dateLabel: 'Hôm nay', title: 'Theo dõi', isCurrent: true },
    ],
    orders: [
      {
        id: 'order-901',
        orderCode: 'LAZ-001012',
        dateLabel: '20/04/2026',
        productName: 'Phụ kiện cao cấp',
        platform: 'lazada',
        amount: 320000,
        statusLabel: 'Giao thành công',
        statusKey: 'completed',
        statusTone: 'success',
      },
    ],
    notes: [
      {
        id: 'note-901',
        content: 'Khách mới, ngân sách cao. Target upgrade program.',
        createdAtLabel: 'bởi BUSINESS - 21/04/2026',
        authorLabel: 'BUSINESS',
      },
    ],
    reviews: [],
    rfm: [
      { label: 'RECENCY', value: '6/10', progressPercent: 62 },
      { label: 'FREQUENCY', value: '1/10', progressPercent: 10 },
      { label: 'MONETARY', value: '4/10', progressPercent: 40 },
    ],
    insight: {
      title: 'AI Phân tích KH',
      confidenceLabel: 'Tin cậy 70%',
      description: 'Khách mới, giá trị đơn hàng cao. Cực kỳ quan trọng kích hoạt mua lần 2.',
      favoriteProductLabel: 'Phụ kiện (100%)',
      favoriteChannelLabel: 'Lazada (88%)',
      churnRiskLabel: 'Medium (32%)',
      churnRiskPercent: 32,
    },
  },
]

function buildListItem(detail: CRMCustomerProfileDetail): CRMCustomerProfileListItem {
  return {
    id: detail.id,
    customerCode: detail.customerCode,
    fullName: detail.fullName,
    maskedPhone: detail.maskedPhone,
    avatarUrl: detail.avatarUrl,
    platformCodes: detail.platformLabels.map((item) => item.id),
    totalOrders: detail.stats.totalOrders,
    totalSpend: detail.stats.totalSpend,
    lastOrderLabel: detail.stats.lastOrderLabel,
    segment: detail.segment,
  }
}

export function buildCRMCustomerProfilesSummary(items: CRMCustomerProfileDetail[]): CRMCustomerProfilesSummary {
  const totalCustomers = items.length
  const totalOrders = items.reduce((accumulator, item) => accumulator + item.stats.totalOrders, 0)
  const totalSpend = items.reduce((accumulator, item) => accumulator + item.stats.totalSpend, 0)
  const averageOrderValue = totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0
  const activePlatforms = new Set(items.flatMap((item) => item.platformLabels.map((platform) => platform.id))).size

  return {
    totalCustomers,
    totalOrders,
    totalSpend,
    averageOrderValue,
    activePlatforms,
  }
}

export function buildCRMCustomerProfilesResponse(params: {
  search?: string
  customerId?: string
} = {}): CRMCustomerProfilesResponse {
  const keyword = params.search?.trim().toLowerCase() ?? ''

  const filtered = customerProfiles.filter((customer) => {
    if (!keyword) return true

    return [customer.fullName, customer.customerCode, customer.maskedPhone, customer.email]
      .join(' ')
      .toLowerCase()
      .includes(keyword)
  })

  const customers = filtered.map(buildListItem)
  const selectedCustomer =
    filtered.find((customer) => customer.id === params.customerId) ?? filtered[0] ?? null

  return {
    summary: buildCRMCustomerProfilesSummary(filtered),
    customers,
    selectedCustomerId: selectedCustomer?.id ?? '',
    selectedCustomer,
  }
}

export const crmCustomerProfilesMock = customerProfiles

export { customerProfiles as crmCustomerProfilesData }
