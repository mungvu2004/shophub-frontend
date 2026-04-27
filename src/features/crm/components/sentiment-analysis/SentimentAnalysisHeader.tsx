import { Download, RefreshCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CRMSentimentAnalysisViewModel } from '@/features/crm/logic/crmSentimentAnalysis.logic'
import { ProductSentimentSelector } from './ProductSentimentSelector'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

type SentimentAnalysisHeaderProps = {
  model: CRMSentimentAnalysisViewModel
  isRefreshing: boolean
  selectedProductId: string
  onSelectProduct: (productId: string) => void
}

function MiniStat({ label, value, tone }: { label: string; value: string | number; tone?: 'indigo' | 'amber' | 'rose' }) {
  return (
    <div className="flex flex-col border-r border-slate-100 px-4 last:border-0">
      <div className="flex items-center gap-1.5">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        {tone && (
          <div
            className={cn(
              'size-1.5 rounded-full',
              tone === 'indigo' ? 'bg-indigo-500' : tone === 'amber' ? 'bg-orange-500' : 'bg-rose-500',
            )}
          />
        )}
      </div>
      <div className="mt-0.5 flex items-center gap-2">
        <span className="font-mono text-xs font-bold text-slate-900">{value}</span>
      </div>
    </div>
  )
}

export function SentimentAnalysisHeader({
  model,
  isRefreshing,
  selectedProductId,
  onSelectProduct,
}: SentimentAnalysisHeaderProps) {
  return (
    <ThemedPageHeader
      title="Trí tuệ Cảm xúc"
      subtitle={
        <div className="flex flex-col gap-2">
          <p>Phân tích sâu sắc thái độ khách hàng và xu hướng thị trường bằng AI.</p>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-purple-600">
            <Sparkles className="size-3" />
            <span>AI Model: Sentiment-X Pro v2</span>
          </div>
        </div>
      }
      theme="crm"
      badge={{ text: 'Customer Insights', icon: <Sparkles className="size-3.5" /> }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Product Selector Integrated in Header */}
        <div className="max-w-[280px]">
          <ProductSentimentSelector selectedProductId={selectedProductId} onSelect={onSelectProduct} />
        </div>

        {/* Mini Stats for context */}
        <div className="hidden items-center rounded-xl border border-purple-100 bg-white/60 py-2 shadow-sm lg:flex">
          <MiniStat label="Tổng đánh giá" value={model.reviews.totalValue} tone="indigo" />
          <MiniStat label="SKU" value={model.sku} tone="amber" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-xl border-purple-200 bg-white/80 font-bold text-purple-900 shadow-sm hover:bg-white hover:text-purple-700 active:scale-95"
          >
            <Download className="mr-2 size-4" />
            Báo cáo
          </Button>

          <Button
            size="sm"
            disabled={isRefreshing}
            className="h-10 rounded-xl bg-purple-600 px-4 font-bold text-white shadow-lg shadow-purple-100 transition-all hover:bg-purple-700 active:scale-95"
          >
            <RefreshCcw className={cn('mr-2 size-4', isRefreshing && 'animate-spin')} />
            Làm mới
          </Button>
        </div>
      </div>
    </ThemedPageHeader>
  )
}
