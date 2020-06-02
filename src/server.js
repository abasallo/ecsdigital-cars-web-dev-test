import 'dotenv/config'

import express from 'express'

import bodyParser from 'body-parser'

import { v4 as uuidv4 } from 'uuid'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const cars = new Map()

cars.set('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', {
  id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
  make: 'SEAT',
  model: 'Makinero',
  colour: 'White',
  year: '1977',
})

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

app.listen(3000, () => console.log(`Example app listening on port ${process.env.PORT}!`))
