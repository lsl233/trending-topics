import { describe, it, expect } from 'vitest'
import { formatTime } from '../../src/utils/time'

describe('formatTime', () => {
  describe('relative format', () => {
    it('should return "刚刚" for current time', () => {
      const now = new Date()
      const result = formatTime(now, 'relative')
      expect(result).toBe('刚刚')
    })

    it('should return "X分钟前" for minutes ago', () => {
      const date = new Date(Date.now() - 30 * 60 * 1000)
      const result = formatTime(date, 'relative')
      expect(result).toBe('30分钟前')
    })

    it('should return "X分钟前" for 1 minute ago', () => {
      const date = new Date(Date.now() - 1 * 60 * 1000)
      const result = formatTime(date, 'relative')
      expect(result).toBe('1分钟前')
    })

    it('should return "X小时前" for hours ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 60 * 1000)
      const result = formatTime(date, 'relative')
      expect(result).toBe('5小时前')
    })

    it('should return "X小时前" for 1 hour ago', () => {
      const date = new Date(Date.now() - 1 * 60 * 60 * 1000)
      const result = formatTime(date, 'relative')
      expect(result).toBe('1小时前')
    })

    it('should return "X天前" for days ago', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      const result = formatTime(date, 'relative')
      expect(result).toBe('3天前')
    })

    it('should return "X天前" for 1 day ago', () => {
      const date = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      const result = formatTime(date, 'relative')
      expect(result).toBe('1天前')
    })

    it('should return date string for older than 7 days', () => {
      const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      const result = formatTime(date, 'relative')
      expect(result).toMatch(/^\d{4}\/\d{1,2}\/\d{1,2}$/)
    })
  })

  describe('full format', () => {
    it('should return full datetime string', () => {
      const date = new Date(2026, 0, 19, 14, 30, 45)
      const result = formatTime(date, 'full')
      expect(result).toBe('2026-01-19 14:30:45')
    })

    it('should pad single digit month', () => {
      const date = new Date(2026, 2, 5, 8, 3, 7)
      const result = formatTime(date, 'full')
      expect(result).toBe('2026-03-05 08:03:07')
    })

    it('should handle timestamp input', () => {
      const date = new Date(2026, 0, 19, 12, 0, 0)
      const timestamp = date.getTime()
      const result = formatTime(timestamp, 'full')
      expect(result).toBe('2026-01-19 12:00:00')
    })

    it('should handle string input', () => {
      const result = formatTime('2026-01-19T12:00:00', 'full')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
    })
  })

  describe('date format', () => {
    it('should return date string in Chinese locale', () => {
      const date = new Date(2026, 0, 19)
      const result = formatTime(date, 'date')
      expect(result).toBe('2026/1/19')
    })

    it('should handle different dates', () => {
      const date = new Date(2024, 11, 25)
      const result = formatTime(date, 'date')
      expect(result).toBe('2024/12/25')
    })
  })

  describe('default behavior', () => {
    it('should use relative format by default', () => {
      const now = new Date()
      const result = formatTime(now)
      expect(result).toBe('刚刚')
    })

    it('should handle various input types', () => {
      const date = new Date()
      const dateString = date.toISOString()
      const timestamp = date.getTime()

      expect(formatTime(date, 'full')).toBe(formatTime(dateString, 'full'))
      expect(formatTime(date, 'full')).toBe(formatTime(timestamp, 'full'))
    })
  })
})
