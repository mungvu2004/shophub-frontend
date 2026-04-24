import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export function useGoalNotifications(progressPercent: number) {
  const lastThreshold = useRef<number>(0)

  useEffect(() => {
    // Chỉ thông báo nếu phần trăm tăng lên và vượt qua các mốc
    if (progressPercent >= 100 && lastThreshold.current < 100) {
      toast.success('Chúc mừng! 🎉', {
        description: 'Bạn đã hoàn thành 100% mục tiêu doanh thu tháng này!',
      })
      lastThreshold.current = 100
    } else if (progressPercent >= 80 && lastThreshold.current < 80) {
      toast.info('Sắp hoàn thành! 🚀', {
        description: 'Bạn đã đạt 80% mục tiêu tháng. Chỉ còn một chút nữa thôi!',
      })
      lastThreshold.current = 80
    } else if (progressPercent >= 50 && lastThreshold.current < 50) {
      toast.info('Tuyệt vời! 👍', {
        description: 'Bạn đã đạt được 50% mục tiêu doanh thu tháng này.',
      })
      lastThreshold.current = 50
    }
  }, [progressPercent])
}
