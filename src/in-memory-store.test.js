import { expect } from '@jest/globals'

import { cars } from './in-memory-store'

test('In memory store should be defined', () => expect(cars).toBeDefined())

test('Initial data should what expected', () => {
  const initialData = cars.get('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')

  expect(initialData).toBeDefined()
  expect(initialData.id).toBe('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')
  expect(initialData.make).toBe('SEAT')
  expect(initialData.model).toBe('Makinero')
  expect(initialData.colour).toBe('White')
  expect(initialData.year).toBe('1977')
})
