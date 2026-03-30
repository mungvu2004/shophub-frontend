export const NAVBAR_WEEK_DAYS = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7']

export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (date.getTime() === today.getTime()) {
    return 'Hôm nay'
  }

  return date.toLocaleDateString('vi-VN', {
    weekday: 'short',
    month: '2-digit',
    day: '2-digit',
  })
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDaysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export function generateCalendarDays(month: Date) {
  const daysInMonth = getDaysInMonth(month)
  const firstDay = getFirstDayOfMonth(month)
  const days: Array<number | null> = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return days
}

export function isFutureDate(date: Date) {
  const candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return candidate.getTime() > todayStart.getTime()
}
