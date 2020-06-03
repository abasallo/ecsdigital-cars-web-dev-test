import HttpStatus from 'http-status-codes'

import { model } from '../server-helper'

import { Router } from 'express'

const router = Router()

router.get('/:id', async (req, res) => {
  const car = await (await model).Car.findOne({ where: { id: req.params.id } })
  if (!car) res.status(HttpStatus.NOT_FOUND)
  res.send(car)
})

router.post('/', async (req, res) =>
  res.send(
    await (await model).Car.create({
      modelId: req.body.modelId,
      colour: req.body.colour,
      year: req.body.year,
    })
  )
)

router.put('/', async (req, res) => {
  const car = await (await model).Car.findOne({ where: { id: req.body.id } })
  if (car) {
    ;(await model).Car.update(
      {
        modelId: req.body.modelId,
        colour: req.body.colour,
        year: req.body.year,
      },
      { where: { id: req.body.id } }
    )
    res.status(HttpStatus.OK)
  } else res.status(HttpStatus.NOT_FOUND)
  return res.send()
})

router.delete('/:id', async (req, res) => {
  const car = await (await model).Car.findOne({ where: { id: req.params.id } })
  if (car) {
    car.destroy()
    res.status(HttpStatus.OK)
  } else res.status(HttpStatus.NOT_FOUND)
  return res.send()
})

export default router
