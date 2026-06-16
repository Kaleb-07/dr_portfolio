import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatYear(year: number): string {
  return String(year)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
}

export function groupBy<T>(items: T[], key: keyof T): Map<string, T[]> {
  const grouped = new Map<string, T[]>()
  for (const item of items) {
    const groupKey = String(item[key])
    const existing = grouped.get(groupKey)
    if (existing) {
      existing.push(item)
    } else {
      grouped.set(groupKey, [item])
    }
  }
  return grouped
}

export function sortBy<T>(items: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}
