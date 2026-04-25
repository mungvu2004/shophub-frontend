import { useEffect, useRef, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardAlertsNotificationsService } from '@/features/dashboard/services/dashboardAlertsNotificationsService'
import type { DashboardAlertRecord } from '@/features/dashboard/logic/dashboardAlertsNotifications.types'

const queryKey = ['dashboard', 'alerts-notifications'] as const

export function useGlobalAlertsMonitor() {
  const previousAlertsRef = useRef<string[]>([])

  const sendBrowserNotification = useCallback((alert: DashboardAlertRecord) => {
    if (!('Notification' in window)) return

    if (Notification.permission === 'granted') {
      new Notification('ShopHub Critical Alert', {
        body: alert.title,
        icon: '/favicon.svg',
      })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('ShopHub Critical Alert', {
            body: alert.title,
            icon: '/favicon.svg',
          })
        }
      })
    }
  }, [])

  const { data } = useQuery({
    queryKey,
    queryFn: () => dashboardAlertsNotificationsService.getAlertsNotifications(),
    staleTime: 20 * 1000,
    refetchInterval: 30 * 1000,
  })

  useEffect(() => {
    if (data?.alerts) {
      const criticalAlerts = data.alerts.filter(a => a.severity === 'critical' && !a.isRead)
      
      criticalAlerts.forEach(alert => {
        if (!previousAlertsRef.current.includes(alert.id)) {
          sendBrowserNotification(alert)
        }
      })

      previousAlertsRef.current = data.alerts.map(a => a.id)
    }
  }, [data, sendBrowserNotification])
}
