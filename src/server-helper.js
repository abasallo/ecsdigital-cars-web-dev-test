import { cars } from './in-memory-store'

import express from 'express'

import cors from 'cors'

import bodyParser from 'body-parser'

import { v4 as uuidv4 } from 'uuid'

export const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/car/:id', (req, res) => {
  const car = cars.get(req.params.id)
  if (car === undefined) res.status(404)
  res.send(car)
})

app.post('/car', (req, res) => {
  const car = { id: uuidv4(), make: req.body.make, model: req.body.model, colour: req.body.colour, year: req.body.year }
  cars.set(car.id, car)
  return res.send(car)
})

app.delete('/car/:id', (req, res) => {
  cars.delete(req.params.id) ? res.status(200) : res.status(404)
  return res.send()
})