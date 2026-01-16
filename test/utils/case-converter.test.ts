import { describe, it, expect } from 'vitest'
import { toCamelCase, toSnakeCase } from '../../src/utils/case-converter'

describe('toCamelCase', () => {
  it('should convert snake_case keys to camelCase', () => {
    expect(toCamelCase({ first_name: 'John', last_name: 'Doe' })).toEqual({
      firstName: 'John',
      lastName: 'Doe'
    })
  })

  it('should handle nested objects', () => {
    expect(toCamelCase({ user: { first_name: 'John', last_name: 'Doe' } })).toEqual({
      user: { firstName: 'John', lastName: 'Doe' }
    })
  })

  it('should handle arrays', () => {
    expect(toCamelCase([
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Smith' }
    ])).toEqual([
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' }
    ])
  })

  it('should handle arrays of nested objects', () => {
    expect(toCamelCase({
      users: [
        { user_info: { first_name: 'John' } },
        { user_info: { first_name: 'Jane' } }
      ]
    })).toEqual({
      users: [
        { userInfo: { firstName: 'John' } },
        { userInfo: { firstName: 'Jane' } }
      ]
    })
  })

  it('should return primitive values unchanged', () => {
    expect(toCamelCase('string')).toBe('string')
    expect(toCamelCase(123)).toBe(123)
    expect(toCamelCase(true)).toBe(true)
  })

  it('should return null unchanged', () => {
    expect(toCamelCase(null)).toBe(null)
  })

  it('should return undefined unchanged', () => {
    expect(toCamelCase(undefined)).toBe(undefined)
  })

  it('should handle empty objects', () => {
    expect(toCamelCase({})).toEqual({})
  })

  it('should handle empty arrays', () => {
    expect(toCamelCase([])).toEqual([])
  })

  it('should handle mixed camelCase and snake_case keys (convert all to camelCase)', () => {
    expect(toCamelCase({ first_name: 'John', lastName: 'Doe' })).toEqual({
      firstName: 'John',
      lastName: 'Doe'
    })
  })

  it('should handle multiple consecutive underscores', () => {
    expect(toCamelCase({ __private_field: 'value' })).toEqual({
      _PrivateField: 'value'
    })
  })

  it('should handle trailing underscores', () => {
    expect(toCamelCase({ field_: 'value' })).toEqual({
      field_: 'value'
    })
  })

  it('should preserve numbers in keys (but not convert snake_case before numbers)', () => {
    expect(toCamelCase({ field_1: 'value', field_2_name: 'value2' })).toEqual({
      field_1: 'value',
      field_2Name: 'value2'
    })
  })
})

describe('toSnakeCase', () => {
  it('should convert camelCase keys to snake_case', () => {
    expect(toSnakeCase({ firstName: 'John', lastName: 'Doe' })).toEqual({
      first_name: 'John',
      last_name: 'Doe'
    })
  })

  it('should handle nested objects', () => {
    expect(toSnakeCase({ user: { firstName: 'John', lastName: 'Doe' } })).toEqual({
      user: { first_name: 'John', last_name: 'Doe' }
    })
  })

  it('should handle arrays', () => {
    expect(toSnakeCase([
      { firstName: 'John', lastName: 'Doe' },
      { firstName: 'Jane', lastName: 'Smith' }
    ])).toEqual([
      { first_name: 'John', last_name: 'Doe' },
      { first_name: 'Jane', last_name: 'Smith' }
    ])
  })

  it('should handle arrays of nested objects', () => {
    expect(toSnakeCase({
      users: [
        { userInfo: { firstName: 'John' } },
        { userInfo: { firstName: 'Jane' } }
      ]
    })).toEqual({
      users: [
        { user_info: { first_name: 'John' } },
        { user_info: { first_name: 'Jane' } }
      ]
    })
  })

  it('should return primitive values unchanged', () => {
    expect(toSnakeCase('string')).toBe('string')
    expect(toSnakeCase(123)).toBe(123)
    expect(toSnakeCase(true)).toBe(true)
  })

  it('should return null unchanged', () => {
    expect(toSnakeCase(null)).toBe(null)
  })

  it('should return undefined unchanged', () => {
    expect(toSnakeCase(undefined)).toBe(undefined)
  })

  it('should handle empty objects', () => {
    expect(toSnakeCase({})).toEqual({})
  })

  it('should handle empty arrays', () => {
    expect(toSnakeCase([])).toEqual([])
  })

  it('should handle snake_case keys unchanged', () => {
    expect(toSnakeCase({ first_name: 'John' })).toEqual({
      first_name: 'John'
    })
  })

  it('should handle multiple consecutive uppercase letters', () => {
    expect(toSnakeCase({ userID: '123', htmlContent: 'content' })).toEqual({
      user_i_d: '123',
      html_content: 'content'
    })
  })

  it('should handle leading uppercase', () => {
    expect(toSnakeCase({ Name: 'John' })).toEqual({
      _name: 'John'
    })
  })

  it('should preserve numbers in keys', () => {
    expect(toSnakeCase({ field1: 'value', field2Name: 'value2' })).toEqual({
      field1: 'value',
      field2_name: 'value2'
    })
  })
})

describe('toCamelCase and toSnakeCase roundtrip', () => {
  it('should convert back and forth preserving values', () => {
    const original = {
      first_name: 'John',
      last_name: 'Doe',
      user_address: {
        street_name: 'Main St',
        city_name: 'New York'
      }
    }

    const camel = toCamelCase(original)
    expect(camel).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      userAddress: {
        streetName: 'Main St',
        cityName: 'New York'
      }
    })

    const snake = toSnakeCase(camel)
    expect(snake).toEqual({
      first_name: 'John',
      last_name: 'Doe',
      user_address: {
        street_name: 'Main St',
        city_name: 'New York'
      }
    })
  })
})
