import 'dotenv/config'

import { beforeAll, expect } from '@jest/globals'

import { app } from './server-helper'

import axios from 'axios'

const DEFAULT_MAX_PARAGRAPH_LENGTH = 50 // TODO - Extract to common constant holder

beforeAll(async () => await app.listen(3000))

test('Should be possible to access initial data', async () => {
  const response = await axios.get('http://localhost:3000/car/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d')

  expect(response.data).toEqual({
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    make: 'SEAT',
    model: 'Makinero',
    modelParagraph: 'marinero mcenroe mcinerney my country make merry',
    colour: 'White',
    year: '1977',
  })
  expect(response.status).toEqual(200)
})

let newCarId
test('Should be possible to add new data', async () => {
  const response = await axios.post('http://localhost:3000/car', { make: 'MCLaren', model: 'P1', colour: 'Grey', year: '1995' })

  newCarId = response.data.id

  expect(newCarId).toBeDefined()
  expect(response.data.make).toBe('MCLaren')
  expect(response.data.model).toBe('P1')
  expect(response.data.modelParagraph.length).toBeGreaterThan(0)
  expect(response.data.modelParagraph.length).toBeLessThanOrEqual(
    Number(process.env.WORDS_SOUNDING_SIMILAR_TO_MODEL_MAX_PARAGRAPH_LENGTH) || DEFAULT_MAX_PARAGRAPH_LENGTH
  )
  expect(response.data.colour).toBe('Grey')
  expect(response.data.year).toBe('1995')
  expect(response.status).toEqual(200)
})

test('Should be possible to update new data', async () => {
  const response = await axios.put('http://localhost:3000/car', {
    id: newCarId,
    make: 'McLaren',
    model: 'F1',
    colour: 'Silver',
    year: '1996',
  })

  expect(response.data.make).toBe('McLaren')
  expect(response.data.model).toBe('F1')
  expect(response.data.modelParagraph.length).toBeGreaterThan(0)
  expect(response.data.modelParagraph.length).toBeLessThanOrEqual(
    Number(process.env.WORDS_SOUNDING_SIMILAR_TO_MODEL_MAX_PARAGRAPH_LENGTH) || DEFAULT_MAX_PARAGRAPH_LENGTH
  )
  expect(response.data.colour).toBe('Silver')
  expect(response.data.year).toBe('1996')
  expect(response.status).toEqual(200)
})

test('Should be possible to access new data', async () => {
  const response = await axios.get(`http://localhost:3000/car/${newCarId}`)

  expect(response.data.id).toBe(newCarId)
  expect(response.data.make).toBe('McLaren')
  expect(response.data.model).toBe('F1')
  expect(response.data.modelParagraph.length).toBeGreaterThan(0)
  expect(response.data.modelParagraph.length).toBeLessThanOrEqual(
    Number(process.env.WORDS_SOUNDING_SIMILAR_TO_MODEL_MAX_PARAGRAPH_LENGTH) || DEFAULT_MAX_PARAGRAPH_LENGTH
  )
  expect(response.data.colour).toBe('Silver')
  expect(response.data.year).toBe('1996')
  expect(response.status).toEqual(200)
})

test('Should be possible to delete just added data', async () => {
  const response = await axios.delete(`http://localhost:3000/car/${newCarId}`)
  expect(response.status).toEqual(200)
})

test('Should not be possible to delete nonexistent data (404)', async () => {
  await axios.delete(`http://localhost:3000/car/${newCarId}`).catch((reason) => {
    expect(reason.response.status).toEqual(404)
  })
})

test('Should not be possible to access nonexistent data (404)', async () => {
  await axios.get(`http://localhost:3000/car/${newCarId}`).catch((reason) => {
    expect(reason.response.status).toEqual(404)
  })
})
