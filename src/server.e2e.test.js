import 'dotenv/config'

import { afterAll, beforeAll, expect } from '@jest/globals'

import { server } from './server-helper'

import { initializeModel } from './orm/model'
import { closeSequelize, connectWithOptions } from './orm/sequelize'

import axios from 'axios'

const DEFAULT_E2E_SERVER_PORT = 3001 // TODO - Extract to common constant holder
const DEFAULT_MAX_PARAGRAPH_LENGTH = 50 // TODO - Extract to common constant holder

beforeAll(async () => {
  await server.listen(DEFAULT_E2E_SERVER_PORT)
  const sequelize = await connectWithOptions(
    process.env.DATABASE_DIALECT,
    process.env.DATABASE_PATH_TEST,
    process.env.DATABASE_POOL_MAX,
    process.env.DATABASE_POOL_MIN,
    process.env.DATABASE_POOL_IDLE
  )
  await initializeModel(sequelize)
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await closeSequelize()
})

let newCarId
test('Should be possible to add new data', async () => {
  const response = await axios.post('http://localhost:3001/car', { make: 'MCLaren', model: 'P1', colour: 'Grey', year: '1995' })
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
  await axios.put('http://localhost:3001/car', { id: newCarId, make: 'McLaren', model: 'F1', colour: 'Silver', year: '1996' })

  const updated = await axios.get(`http://localhost:3001/car/${newCarId}`)

  expect(updated.data.make).toBe('McLaren')
  expect(updated.data.model).toBe('F1')
  expect(updated.data.modelParagraph.length).toBeGreaterThan(0)
  expect(updated.data.modelParagraph.length).toBeLessThanOrEqual(
    Number(process.env.WORDS_SOUNDING_SIMILAR_TO_MODEL_MAX_PARAGRAPH_LENGTH) || DEFAULT_MAX_PARAGRAPH_LENGTH
  )
  expect(updated.data.colour).toBe('Silver')
  expect(updated.data.year).toBe('1996')
  expect(updated.status).toEqual(200)
})

test('Should be possible to access new data', async () => {
  const response = await axios.get(`http://localhost:3001/car/${newCarId}`)

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
  const response = await axios.delete(`http://localhost:3001/car/${newCarId}`)
  expect(response.status).toEqual(200)
})

test('Should not be possible to access nonexistent data (404)', async () =>
  await axios.get(`http://localhost:3001/car/${newCarId}`).catch((reason) => expect(reason.response.status).toEqual(404)))

test('Should not be possible to update nonexistent data (404)', async () =>
  await axios
    .put('http://localhost:3001/car', { id: newCarId, make: 'McLaren', model: 'F1', colour: 'Silver', year: '1996' })
    .catch((reason) => expect(reason.response.status).toEqual(404)))

test('Should not be possible to delete nonexistent data (404)', async () =>
  await axios.delete(`http://localhost:3001/car/${newCarId}`).catch((reason) => expect(reason.response.status).toEqual(404)))
