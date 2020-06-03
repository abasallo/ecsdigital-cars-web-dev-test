import 'dotenv/config'

import constants from './modules/constants'

import HttpStatus from 'http-status-codes'

import { afterAll, beforeAll, expect } from '@jest/globals'

import { server } from './server-helper'

import { initializeModel } from './orm/model'
import { closeSequelize, connectWithOptions } from './orm/sequelize'

import axios from 'axios'

beforeAll(async () => {
  await server.listen(constants.DEFAULT_E2E_SERVER_PORT)
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

// Make - CRU

let newMakeId
test('Make - Should be possible to add new data', async () => {
  const response = await axios.post(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/make`, { name: 'MCLaren' })
  newMakeId = response.data.id

  expect(response.data.id).toBeDefined()
  expect(response.data.name).toBe('MCLaren')
  expect(response.status).toEqual(HttpStatus.OK)
})

test('Make - Should be possible to update an existing data', async () => {
  await axios.put(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/make`, { id: newMakeId, name: 'McLaren' })
  const updated = await axios.get(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/make/${newMakeId}`)

  expect(updated.data.id).toBe(newMakeId)
  expect(updated.data.name).toBe('McLaren')
  expect(updated.status).toEqual(HttpStatus.OK)
})

test('Make - Should be possible to access existing data', async () => {
  const response = await axios.get(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/make/${newMakeId}`)

  expect(response.data.id).toBe(newMakeId)
  expect(response.data.name).toBe('McLaren')
  expect(response.status).toEqual(HttpStatus.OK)
})

// Model - CRU

let newModelId
test('Model - Should be possible to add new data', async () => {
  const response = await axios.post(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/model`, { name: 'F-One' })
  newModelId = response.data.id

  expect(response.data.id).toBeDefined()
  expect(response.data.makeId).toBe(undefined)
  expect(response.data.name).toBe('F-One')
  expect(response.data.similarSoundingWordToNameParagraph.length).toBeGreaterThan(0)
  expect(response.data.similarSoundingWordToNameParagraph.length).toBeLessThanOrEqual(
    Number(process.env.WORDS_SOUNDING_SIMILAR_TO_MODEL_MAX_PARAGRAPH_LENGTH) || constants.DEFAULT_MAX_PARAGRAPH_LENGTH
  )
  expect(response.status).toEqual(HttpStatus.OK)
})

test('Model - Should be possible to update an existing data', async () => {
  await axios.put(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/model`, { id: newModelId, makeId: newMakeId, name: 'F1' })
  const updated = await axios.get(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/model/${newModelId}`)

  expect(updated.data.id).toBe(newModelId)
  expect(updated.data.makeId).toBe(newMakeId)
  expect(updated.data.name).toBe('F1')
  expect(updated.data.similarSoundingWordToNameParagraph.length).toBeGreaterThan(0)
  expect(updated.data.similarSoundingWordToNameParagraph.length).toBeLessThanOrEqual(
    Number(process.env.WORDS_SOUNDING_SIMILAR_TO_MODEL_MAX_PARAGRAPH_LENGTH) || constants.DEFAULT_MAX_PARAGRAPH_LENGTH
  )
  expect(updated.status).toEqual(HttpStatus.OK)
})

test('Model - Should be possible to access existing data', async () => {
  const response = await axios.get(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/model/${newModelId}`)

  expect(response.data.id).toBe(newModelId)
  expect(response.data.makeId).toBe(newMakeId)
  expect(response.data.name).toBe('F1')
  expect(response.status).toEqual(HttpStatus.OK)
})

// Car - CRU

let newCarId
test('Car - Should be possible to add new data', async () => {
  const response = await axios.post(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/car`, { colour: 'Grey', year: '1995' })
  newCarId = response.data.id

  expect(response.data.id).toBeDefined()
  expect(response.data.modelId).toBe(undefined)
  expect(response.data.colour).toBe('Grey')
  expect(response.data.year).toBe('1995')
  expect(response.status).toEqual(HttpStatus.OK)
})

test('Car - Should be possible to update new data', async () => {
  await axios.put(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/car`, {
    id: newCarId,
    modelId: newModelId,
    colour: 'Silver',
    year: '1996',
  })

  const updated = await axios.get(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/car/${newCarId}`)

  expect(updated.data.id).toBe(newCarId)
  expect(updated.data.modelId).toBe(newModelId)
  expect(updated.data.colour).toBe('Silver')
  expect(updated.data.year).toBe('1996')
  expect(updated.status).toEqual(HttpStatus.OK)
})

test('Car - Should be possible to access new data', async () => {
  const response = await axios.get(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/car/${newCarId}`)

  expect(response.data.id).toBe(newCarId)
  expect(response.data.modelId).toBe(newModelId)
  expect(response.data.colour).toBe('Silver')
  expect(response.data.year).toBe('1996')
  expect(response.status).toEqual(HttpStatus.OK)
})

// Car - D

test('Car - Should be possible to delete just added data', async () => {
  const response = await axios.delete(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/car/${newCarId}`)
  expect(response.status).toEqual(HttpStatus.OK)
})

test('Car - Should not be possible to access nonexistent data (404)', async () =>
  await axios
    .get(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/car/${newCarId}`)
    .catch((reason) => expect(reason.response.status).toEqual(HttpStatus.NOT_FOUND)))

test('Car - Should not be possible to update nonexistent data (404)', async () =>
  await axios
    .put(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/car`, { id: newCarId, colour: 'Red', year: 'HttpStatus.OK0' })
    .catch((reason) => expect(reason.response.status).toEqual(HttpStatus.NOT_FOUND)))

test('Car - Should not be possible to delete nonexistent data (404)', async () =>
  await axios
    .delete(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/car/${newCarId}`)
    .catch((reason) => expect(reason.response.status).toEqual(HttpStatus.NOT_FOUND)))

// Model - D

test('Model - Should be possible to delete just added data', async () => {
  const response = await axios.delete(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/model/${newModelId}`)
  expect(response.status).toEqual(HttpStatus.OK)
})

test('Model - Should not be possible to access nonexistent data (404)', async () =>
  await axios
    .get(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/model/${newModelId}`)
    .catch((reason) => expect(reason.response.status).toEqual(HttpStatus.NOT_FOUND)))

test('Model - Should not be possible to update nonexistent data (404)', async () =>
  await axios
    .put(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/model`, { id: newModelId, name: 'F40' })
    .catch((reason) => expect(reason.response.status).toEqual(HttpStatus.NOT_FOUND)))

test('Model - Should not be possible to delete nonexistent data (404)', async () =>
  await axios
    .delete(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/model/${newModelId}`)
    .catch((reason) => expect(reason.response.status).toEqual(HttpStatus.NOT_FOUND)))

// Make - D

test('Make - Should be possible to delete just added data', async () => {
  const response = await axios.delete(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/make/${newMakeId}`)
  expect(response.status).toEqual(HttpStatus.OK)
})

test('Make - Should not be possible to access nonexistent data (404)', async () =>
  await axios
    .get(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/make/${newMakeId}`)
    .catch((reason) => expect(reason.response.status).toEqual(HttpStatus.NOT_FOUND)))

test('Make - Should not be possible to update nonexistent data (404)', async () =>
  await axios
    .put(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/make`, { id: newMakeId, name: 'Ferrari' })
    .catch((reason) => expect(reason.response.status).toEqual(HttpStatus.NOT_FOUND)))

test('Make - Should not be possible to delete nonexistent data (404)', async () =>
  await axios
    .delete(`http://localhost:${constants.DEFAULT_E2E_SERVER_PORT}/make/${newMakeId}`)
    .catch((reason) => expect(reason.response.status).toEqual(HttpStatus.NOT_FOUND)))
