import { v4 as uuidv4 } from 'uuid'

import { model } from '../server-helper'

import { Router } from 'express'

const router = Router()

router.get('/:id', async (req, res) => {
  const make = await (await model).Make.findOne({ where: { id: req.params.id } })
  if (!make) res.status(404)
  res.send(make)
})

// TODO - Maybe replace by Sequelize native functionality for UUIDv4
router.post('/', async (req, res) => res.send(await (await model).Make.create({ id: uuidv4(), name: req.body.name })))

router.put('/', async (req, res) => {
  const make = await (await model).Make.findOne({ where: { id: req.body.id } })
  if (make) {
    ;(await model).Make.update({ name: req.body.name }, { where: { id: req.body.id } })
    res.status(200)
  } else res.status(404)
  return res.send()
})

router.delete('/:id', async (req, res) => {
  const make = await (await model).Make.findOne({ where: { id: req.params.id } })
  if (make) {
    make.destroy()
    res.status(200)
  } else res.status(404)
  return res.send()
})

export default router
