import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Image as ImageIcon, 
  MessageSquare, 
  ShieldAlert, 
  Upload, 
  Send, 
  ChevronRight, 
  History, 
  Package,
  User,
  AlertCircle,
  FileQuestion
} from 'lucide-react'
import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { ordersReturnsService } from '../../services/ordersReturnsService'

type Template = {
  id: string
  title: string
  content: string
}

const templates: Template[] = [
  { id: '1', title: 'Chấp nhận hoàn tiền', content: 'Chào bạn, chúng tôi đã nhận được yêu cầu và đồng ý hoàn tiền cho đơn hàng này. Tiền sẽ được hoàn về ví của bạn trong 3-5 ngày làm việc.' },
  { id: '2', title: 'Yêu cầu thêm bằng chứng', content: 'Chào bạn, vui lòng cung cấp thêm video quay cảnh mở hàng (unboxing) để chúng tôi có đủ cơ sở giải quyết khiếu nại này.' },
  { id: '3', title: 'Từ chối (Hàng đã qua sử dụng)', content: 'Chào bạn, rất tiếc chúng tôi không thể chấp nhận yêu cầu trả hàng do sản phẩm đã có dấu hiệu qua sử dụng và không còn tem mác.' },
]

type OrdersReturnsDetailDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  order: {
    id: string
    orderCode: string
    productName: string
    customerName: string
    amountLabel: string
    statusLabel: string
    isAbuseFlagged: boolean
    hasEvidence: boolean
    reason: string
    happenedAtLabel: string
    sku: string
    skuDetails: string
    abuseNote?: string
  } | null
}

export function OrdersReturnsDetailDialog({ isOpen, onOpenChange, order }: OrdersReturnsDetailDialogProps) {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!order) return null

  const applyTemplate = (content: string) => {
    setMessage(content)
  }

  const handleAction = async (type: 'approve' | 'reject') => {
    setIsSubmitting(true)
    const loadingToast = toast.loading(`Đang cập nhật trạng thái...`)
    try {
      if (type === 'approve') await ordersReturnsService.approveReturn(order.id)
      else await ordersReturnsService.rejectReturn(order.id)
      
      toast.success(`${type === 'approve' ? 'Phê duyệt' : 'Từ chối'} đơn hàng ${order.orderCode} thành công`, { id: loadingToast })
      onOpenChange(false)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xử lý yêu cầu', { id: loadingToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendResponse = async () => {
    if (!message.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi')
      return
    }
    setIsSubmitting(true)
    const loadingToast = toast.loading('Đang gửi phản hồi...')
    try {
      await ordersReturnsService.sendResponse(order.id, message)
      toast.success('Đã gửi phản hồi cho khách hàng thành công', { id: loadingToast })
      onOpenChange(false)
    } catch (error) {
      toast.error('Không thể gửi phản hồi lúc này', { id: loadingToast })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const loadingToast = toast.loading(`Đang tải lên ${files.length} tệp tin...`)
      try {
        await ordersReturnsService.uploadEvidence(order.id, Array.from(files))
        toast.success(`Đã tải lên minh chứng thành công`, { id: loadingToast })
      } catch (error) {
        toast.error('Lỗi khi tải lên tệp tin', { id: loadingToast })
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent variant="drawer-right" showCloseButton={true} className="dark:bg-slate-900 dark:border-slate-800">
        <input 
          type="file" 
          multiple 
          hidden 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept="image/*,video/*"
        />
        {/* Custom Content Container */}
        <div className="flex h-full flex-col bg-white dark:bg-slate-900">
          {/* Header Area */}
          <div className="flex items-center gap-2 border-b border-slate-50 px-6 py-5 dark:border-slate-800">
            <h2 className="text-[16px] font-bold text-slate-900 dark:text-slate-100">Chi tiết yêu cầu</h2>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="font-mono text-[14px] font-bold text-indigo-600 dark:text-indigo-400">#{order.orderCode}</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Summary Banner */}
            <section className="bg-slate-50/50 px-6 py-8 dark:bg-slate-800/20">
              <div className="mb-6 flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={order.statusLabel === 'ĐANG XỬ LÝ' ? 'primary' : 'outline'} className="font-bold">
                      {order.statusLabel}
                    </Badge>
                    {order.isAbuseFlagged && (
                      <Badge variant="danger" className="animate-pulse px-2 py-0.5 text-[10px] font-bold">
                        <ShieldAlert className="mr-1 h-3 w-3" />
                        RỦI RO CAO
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-[24px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">{order.amountLabel}</h3>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900 ring-1 ring-slate-100 dark:ring-slate-800">
                  <Package className="h-6 w-6 text-indigo-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.05em] text-slate-400">
                    <User className="h-3 w-3" />
                    Khách hàng
                  </p>
                  <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{order.customerName}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="flex items-center justify-end gap-1.5 text-[10px] font-bold uppercase tracking-[0.05em] text-slate-400">
                    <History className="h-3 w-3" />
                    Thời gian tạo
                  </p>
                  <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200">{order.happenedAtLabel}</p>
                </div>
              </div>
            </section>

            <div className="p-6 space-y-10 pb-24">
              {/* Customer Reason Section */}
              <section className="space-y-4">
                <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <FileQuestion className="h-3.5 w-3.5" />
                  Lý do từ khách hàng
                </h4>
                <div className="rounded-2xl bg-indigo-50/30 p-4 border border-indigo-100/50 dark:bg-indigo-900/10 dark:border-indigo-900/30">
                  <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
                    "{order.reason}"
                  </p>
                </div>
              </section>

              {/* Product Info */}
              <section className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Thông tin sản phẩm</h4>
                <div className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <ImageIcon className="h-6 w-6 text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{order.productName}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">{order.sku}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-200" />
                      <span className="text-[11px] text-slate-400">{order.skuDetails}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Media Evidence */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Minh chứng từ khách hàng</h4>
                  <Badge variant="neutral" className="text-[10px] h-5">2 ẢNH</Badge>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                      <div className="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <ImageIcon className="h-7 w-7 text-slate-300" />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 dark:border-slate-800 transition-all group disabled:opacity-50"
                  >
                    <Upload className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 uppercase">Thêm</span>
                  </button>
                </div>
              </section>

              {/* Chat/Response Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Phản hồi & Trao đổi
                  </h4>
                </div>
                
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-2">
                    {templates.map((t) => (
                      <button 
                        key={t.id}
                        disabled={isSubmitting}
                        className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[11px] font-bold text-slate-600 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 disabled:opacity-50"
                        onClick={() => applyTemplate(t.content)}
                      >
                        {t.title}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative mt-2">
                  <textarea
                    className="min-h-[160px] w-full rounded-2xl border border-slate-200 bg-white p-5 text-[14px] leading-relaxed transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 disabled:opacity-50"
                    placeholder="Viết nội dung phản hồi..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {order.isAbuseFlagged && (
                    <div className="mt-3 flex items-start gap-3 rounded-xl bg-rose-50/50 p-3.5 text-rose-600 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold uppercase">Cảnh báo hành vi</p>
                        <p className="text-[12px] opacity-90">Khách hàng này có tỷ lệ hoàn hàng bất thường (80% đơn hàng). Hãy cẩn trọng khi phê duyệt.</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-11 rounded-xl font-bold text-slate-500 dark:border-slate-800"
                onClick={() => handleAction('reject')}
                disabled={isSubmitting}
              >
                TỪ CHỐI
              </Button>
              <Button 
                className="flex-1 h-11 rounded-xl bg-indigo-600 font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700"
                onClick={handleSendResponse}
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                GỬI PHẢN HỒI
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
