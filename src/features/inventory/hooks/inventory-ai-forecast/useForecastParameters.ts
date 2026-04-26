import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export function useForecastParameters() {
  const [isRecalculating, setIsRecalculating] = useState(false)

  const recalculate = useCallback(async (params: any) => {
    setIsRecalculating(true)
    
    // Giả lập thời gian AI tính toán lại
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setIsRecalculating(false)
    toast.success('AI đã tính toán lại dự báo dựa trên các tham số mới!', {
      description: 'Số lượng gợi ý đã được cập nhật cho các sự kiện sắp tới.',
    })
  }, [])

  return {
    isRecalculating,
    recalculate,
  }
}
