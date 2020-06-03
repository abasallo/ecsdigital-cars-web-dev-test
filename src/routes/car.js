import { v4 as uuidv4 } from 'uuid'

import { model } from '../server-helper'

import { Router } from 'express'

const router = Router()

router.get('/:id', async (req, res) => {
  const car = await (await model).Car.findOne({ where: { id: req.params.id } })
  if (!car) res.status(404)
  res.send(car)
})

// TODO - Maybe replace by Sequelize native functionality for UUIDv4
router.post('/', async (req, res) =>
  res.send(
    await (await model).Car.create({
      id: uuidv4(),
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
    res.status(200)
  } else res.status(404)
  return res.send()
})

router.delete('/:id', async (req, res) => {
  const car = await (await model).Car.findOne({ where: { id: req.params.id } })
  if (car) {
    car.destroy()
    res.status(200)
  } else res.status(404)
  return res.send()
})

export default router
