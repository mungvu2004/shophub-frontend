import React, { useState } from 'react'
import { useAlertSettings } from '@/features/dashboard/hooks/useAlertSettings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Settings2, Save, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { AlertThreshold } from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

export const AlertThresholdSettings: React.FC = () => {
  const { thresholds, isLoading, updateThreshold, isUpdating } = useAlertSettings()
  const [dirtyValues, setDirtyValues] = useState<Record<string, number>>({})

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const handleInputChange = (id: string, value: string) => {
    const val = parseInt(value, 10)
    if (isNaN(val)) return
    setDirtyValues(prev => ({ ...prev, [id]: val }))
  }

  const handleUpdate = (threshold: AlertThreshold) => {
    const newValue = dirtyValues[threshold.id]
    if (newValue === undefined || newValue === threshold.value) return

    const confirmSave = window.confirm(`Bạn có chắc muốn thay đổi ${threshold.label} từ ${threshold.value} thành ${newValue} ${threshold.unit}? Đây là ngưỡng quan trọng ảnh hưởng đến toàn hệ thống.`)
    
    if (!confirmSave) return

    updateThreshold(
      { ...threshold, value: newValue },
      {
        onSuccess: () => {
          toast.success(`Đã cập nhật ${threshold.label} thành công`, {
            description: `Hệ thống sẽ áp dụng ngưỡng ${newValue} ${threshold.unit} ngay lập tức.`
          })
          setDirtyValues(prev => {
            const next = { ...prev }
            delete next[threshold.id]
            return next
          })
        },
        onError: (error: Error) => {
          toast.error(`Lỗi cập nhật ${threshold.label}`, {
            description: error?.message || 'Vui lòng kiểm tra lại kết nối mạng và thử lại.'
          })
        },
      }
    )
  }

  return (
    <Card className="h-full border-slate-200/60 shadow-sm overflow-hidden bg-white">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 shadow-sm">
            <Settings2 className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-extrabold text-slate-900 tracking-tight">
              Cấu hình ngưỡng cảnh báo
            </CardTitle>
            <CardDescription className="text-xs font-medium text-slate-500">
              Tùy chỉnh thông số kích hoạt thông báo vận hành
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="divide-y divide-slate-100 p-0">
        {thresholds.map((threshold) => {
          const isDirty = dirtyValues[threshold.id] !== undefined && dirtyValues[threshold.id] !== threshold.value
          return (
            <div key={threshold.id} className="p-5 transition-colors hover:bg-slate-50/50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <label 
                      htmlFor={threshold.id} 
                      className="text-sm font-bold text-slate-800 tracking-tight block"
                    >
                      {threshold.label}
                    </label>
                    {isDirty && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                        <AlertCircle className="w-3 h-3" />
                        Chưa lưu
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-500 font-medium max-w-xs">
                    {threshold.description}
                  </p>
                </div>
                <div className="flex w-full flex-shrink-0 items-center gap-3 sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Input
                      id={threshold.id}
                      type="number"
                      defaultValue={threshold.value}
                      onChange={(e) => handleInputChange(threshold.id, e.target.value)}
                      className="h-10 w-full rounded-xl border-slate-200 pr-12 text-sm font-black text-slate-900 shadow-sm focus:border-primary-400 focus:ring-primary-100 sm:w-[120px]"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {threshold.unit === 'sản phẩm' ? 'SKU' : threshold.unit}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant={isDirty ? "default" : "ghost"}
                    disabled={isUpdating || !isDirty}
                    onClick={() => handleUpdate(threshold)}
                    className={cn(
                      "h-10 w-10 rounded-xl transition-all active:scale-95 border",
                      isDirty 
                        ? "bg-primary-600 text-white shadow-md shadow-primary-200 border-primary-600 hover:bg-primary-700" 
                        : "text-slate-400 border-transparent hover:bg-white hover:text-primary-600 hover:shadow-md hover:border-slate-100"
                    )}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
