/**
 * Utilidades para manejo de fechas
 */

export function formatDate(date: Date | string, locale = 'es-ES'): string {
  const d = new Date(date)
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(date: Date | string, locale = 'es-ES'): string {
  const d = new Date(date)
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(date: Date | string, locale = 'es-ES'): string {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`
}

export function getDaysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

export function isToday(date: Date | string): boolean {
  const d = new Date(date)
  const today = new Date()
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}
