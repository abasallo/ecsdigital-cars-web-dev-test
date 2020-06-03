import express from 'express'

import cors from 'cors'

import bodyParser from 'body-parser'

import { v4 as uuidv4 } from 'uuid'

import { fewWordsSoundingLike } from './data-muse'

import { initSequelize } from './orm/sequelize'

export const model = initSequelize()

export const server = express()

server.use(cors())

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.get('/car/:id', async (req, res) => {
  const car = await (await model).Car.findOne({ where: { id: req.params.id } })
  if (!car) res.status(404)
  res.send(car)
})

server.post('/car', async (req, res) =>
  res.send(
    await (await model).Car.create({
      id: uuidv4(), // TODO - Maybe replace by Sequelize native functionality for this
      make: req.body.make,
      model: req.body.model,
      modelParagraph: await fewWordsSoundingLike(req.body.model),
      colour: req.body.colour,
      year: req.body.year,
    })
  )
)

server.put('/car', async (req, res) => {
  const car = await (await model).Car.findOne({ where: { id: req.body.id } })
  if (car) {
    ;(await model).Car.update(
      {
        make: req.body.make,
        model: req.body.model,
        modelParagraph: await fewWordsSoundingLike(req.body.model),
        colour: req.body.colour,
        year: req.body.year,
      },
      { where: { id: req.body.id } }
    )
    res.status(200)
  } else res.status(404)
  return res.send()
})

server.delete('/car/:id', async (req, res) => {
  const car = await (await model).Car.findOne({ where: { id: req.params.id } })
  if (car) {
    car.destroy()
    res.status(200)
  } else res.status(404)
  return res.send()
})
