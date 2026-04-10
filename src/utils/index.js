import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const formatRelativeTime = (dateStr) => {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

export const formatDate = (dateStr) => {
  try {
    return format(parseISO(dateStr), 'MMM d, yyyy')
  } catch {
    return dateStr
  }
}

export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

export const truncate = (str, n = 240) =>
  str?.length > n ? str.slice(0, n) + '…' : str

export const clsx = (...classes) => classes.filter(Boolean).join(' ')

export const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export const debounce = (fn, delay) => {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}

export const getContribColor = (count, theme = 'dark') => {
  if (count === 0) return theme === 'dark' ? '#1e2025' : '#eaeaea'
  if (count <= 2) return theme === 'dark' ? '#1a4a3a' : '#c6e9d6'
  if (count <= 5) return theme === 'dark' ? '#226644' : '#7bc99a'
  if (count <= 10) return theme === 'dark' ? '#2d8a5a' : '#3d9e68'
  return theme === 'dark' ? '#3db87a' : '#1a7a4a'
}

export const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n?.toString() || '0'
}
