import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardAlertsNotificationsService } from '@/features/dashboard/services/dashboardAlertsNotificationsService'
import { toast } from 'sonner'

const queryKey = ['dashboard', 'alerts-notifications'] as const

export function useDashboardAlertsNotifications() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey,
    queryFn: () => dashboardAlertsNotificationsService.getAlertsNotifications(),
    staleTime: 20 * 1000,
    refetchInterval: 30 * 1000,
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => dashboardAlertsNotificationsService.markAllAsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey })
      toast.success('Đã đánh dấu tất cả là đã đọc')
    },
    onError: () => toast.error('Không thể cập nhật trạng thái đã đọc'),
  })

  const dismissAlertMutation = useMutation({
    mutationFn: (alertId: string) => dashboardAlertsNotificationsService.dismissAlert(alertId),
    onSuccess: async (_, alertId) => {
      await queryClient.invalidateQueries({ queryKey })
      toast.success('Đã bỏ qua cảnh báo', {
        action: {
          label: 'Hoàn tác',
          onClick: () => undismissAlertMutation.mutate(alertId)
        }
      })
    },
    onError: () => toast.error('Lỗi khi bỏ qua cảnh báo'),
  })

  const undismissAlertMutation = useMutation({
    mutationFn: (alertId: string) => dashboardAlertsNotificationsService.undismissAlert(alertId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey })
      toast.success('Đã khôi phục cảnh báo')
    },
  })

  const assignAlertMutation = useMutation({
    mutationFn: ({ alertId, userId }: { alertId: string; userId: string | null; previousUserId?: string | null }) => 
      dashboardAlertsNotificationsService.assignAlert(alertId, userId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey })
      toast.success(variables.userId ? 'Đã phân công nhân sự' : 'Đã gỡ phân công', {
        action: {
          label: 'Hoàn tác',
          onClick: () => assignAlertMutation.mutate({ 
            alertId: variables.alertId, 
            userId: variables.previousUserId || null 
          })
        }
      })
    },
    onError: () => toast.error('Lỗi khi cập nhật phân công'),
  })

  return {
    ...query,
    markAllRead: markAllReadMutation.mutate,
    isMarkingAllRead: markAllReadMutation.isPending,
    dismissAlert: dismissAlertMutation.mutate,
    isDismissingAlert: dismissAlertMutation.isPending,
    assignAlert: assignAlertMutation.mutate,
    isAssigningAlert: assignAlertMutation.isPending,
  }
}
