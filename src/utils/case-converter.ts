export function toCamelCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj

  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item)) as any
  }

  if (typeof obj !== 'object') {
    return obj
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    acc[camelKey] = typeof obj[key] === 'object' && obj[key] !== null ? toCamelCase(obj[key]) : obj[key]
    return acc
  }, {} as any)
}

export function toSnakeCase<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj

  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item)) as any
  }

  if (typeof obj !== 'object') {
    return obj
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    acc[snakeKey] = typeof obj[key] === 'object' && obj[key] !== null ? toSnakeCase(obj[key]) : obj[key]
    return acc
  }, {} as any)
}
