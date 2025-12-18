import { format } from 'date-fns'

/**
 * Formats a date consistently for both server and client rendering
 * Uses a fixed format to prevent hydration mismatches
 * @param date - Date object or date string
 * @returns Formatted date string (MM/DD/YYYY)
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'MM/dd/yyyy')
}

/**
 * Formats a date with time for both server and client rendering
 * @param date - Date object or date string
 * @returns Formatted date string (MM/DD/YYYY HH:mm)
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'MM/dd/yyyy HH:mm')
}
