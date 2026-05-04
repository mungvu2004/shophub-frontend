import { Sparkles, Info, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AiInsightBlockProps {
  title: string
  modelName: string
  updatedAt: string
  confidence: number
  description: string
  mainValue?: string
  predictionLabel: string
  predictionValue: string
  type?: 'inventory' | 'revenue' | 'sentiment'
  onAction?: () => void
  className?: string
}

export function AiInsightBlock({
  title,
  modelName,
  updatedAt,
  confidence,
  description,
  mainValue,
  predictionLabel,
  predictionValue,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type: _type = 'inventory',
  onAction,
  className
}: AiInsightBlockProps) {
  return (
    <article className={cn(
      "overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-md transition-all hover:shadow-lg",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-primary-50 to-indigo-50/30 px-6 py-4 border-b border-primary-100">
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="gap-1 font-bold">
            <Sparkles className="size-3" />
            AI
          </Badge>
          <h3 className="text-sm font-bold text-secondary-900">{title}</h3>
        </div>
        <button className="text-secondary-400 hover:text-secondary-600">
          <Info className="size-4" />
        </button>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-4 bg-secondary-50/50 px-6 py-2 border-b border-secondary-100 text-[10px] text-secondary-500 font-medium uppercase tracking-wider">
        <span>Cập nhật: {updatedAt}</span>
        <span>Model: {modelName}</span>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <p className="text-xs font-semibold text-secondary-500 mb-1">{description}</p>
        {mainValue && (
          <h4 className="text-lg font-bold text-secondary-900 mb-3">{mainValue}</h4>
        )}

        <div className="rounded-xl bg-secondary-50 p-4 border border-secondary-100">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-secondary-400">{predictionLabel}</span>
              <p className="text-sm font-bold text-secondary-900">{predictionValue}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-secondary-100">
              <ArrowRight className="size-4 text-primary-500" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-lg bg-success-50 border border-success-100 px-2 py-1">
            <div className="size-1.5 rounded-full bg-success-500" />
            <span className="text-[10px] font-bold text-success-700">Độ tin cậy: {confidence}%</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between bg-secondary-50/30 px-6 py-4 border-t border-secondary-100">
        <Button variant="ghost" size="sm" className="text-xs font-bold">Xem chi tiết</Button>
        <Button variant="cta" size="sm" onClick={onAction} className="text-xs font-bold">
          Thực hiện ngay
        </Button>
      </div>
    </article>
  )
}
