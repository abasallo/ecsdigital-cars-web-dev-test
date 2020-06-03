import HttpStatus from 'http-status-codes'

import { model } from '../server-helper'

import { Router } from 'express'

const router = Router()

router.get('/:id', async (req, res) => {
  const make = await (await model).Make.findOne({ where: { id: req.params.id } })
  if (!make) res.status(HttpStatus.NOT_FOUND)
  res.send(make)
})

router.post('/', async (req, res) => res.send(await (await model).Make.create({ name: req.body.name })))

router.put('/', async (req, res) => {
  const make = await (await model).Make.findOne({ where: { id: req.body.id } })
  if (make) {
    ;(await model).Make.update({ name: req.body.name }, { where: { id: req.body.id } })
    res.status(HttpStatus.OK)
  } else res.status(HttpStatus.NOT_FOUND)
  return res.send()
})

router.delete('/:id', async (req, res) => {
  const make = await (await model).Make.findOne({ where: { id: req.params.id } })
  if (make) {
    make.destroy()
    res.status(HttpStatus.OK)
  } else res.status(HttpStatus.NOT_FOUND)
  return res.send()
})

export default router
