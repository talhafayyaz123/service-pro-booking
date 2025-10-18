import '@testing-library/jest-dom'

import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'

describe('getCurrencySignByName', () => {
  test('should return $ when name is undefined', () => {
    expect(getCurrencySignByName()).toBe('$')
  })

  test('should return $ when name is null', () => {
    expect(getCurrencySignByName(undefined)).toBe('$')
  })

  test('should return $ when name is an empty string', () => {
    expect(getCurrencySignByName('')).toBe('$')
  })

  test('should return $ when name is "usd"', () => {
    expect(getCurrencySignByName('usd')).toBe('$')
  })

  test('should return $ when name is "USD" (case insensitive)', () => {
    expect(getCurrencySignByName('USD')).toBe('$')
  })

  test('should return د.إ when name is "aed"', () => {
    expect(getCurrencySignByName('aed')).toBe('د.إ')
  })

  test('should return د.إ when name is "AED" (case insensitive)', () => {
    expect(getCurrencySignByName('AED')).toBe('د.إ')
  })

  test('should return $ when name is "$"', () => {
    expect(getCurrencySignByName('$')).toBe('$')
  })

  test('should return د.إ when name is "د.إ"', () => {
    expect(getCurrencySignByName('د.إ')).toBe('د.إ')
  })

  test('should return $ for any other value', () => {
    expect(getCurrencySignByName('eur')).toBe('$')
    expect(getCurrencySignByName('random')).toBe('$')
  })
})
