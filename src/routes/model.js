import { fewWordsSoundingLike } from '../data-muse'

import { v4 as uuidv4 } from 'uuid'

import { model as sequelizeModel } from '../server-helper'

import { Router } from 'express'

const router = Router()

router.get('/:id', async (req, res) => {
  const model = await (await sequelizeModel).Model.findOne({ where: { id: req.params.id } })
  if (!model) res.status(404)
  res.send(model)
})

// TODO - Maybe replace by Sequelize native functionality for UUIDv4
router.post('/', async (req, res) =>
  res.send(
    await (await sequelizeModel).Model.create({
      id: uuidv4(),
      makeId: req.body.makeId,
      name: req.body.name,
      similarSoundingWordToNameParagraph: await fewWordsSoundingLike(req.body.name),
    })
  )
)

router.put('/', async (req, res) => {
  const model = await (await sequelizeModel).Model.findOne({ where: { id: req.body.id } })
  if (model) {
    ;(await sequelizeModel).Model.update(
      { makeId: req.body.makeId, name: req.body.name, similarSoundingWordToNameParagraph: await fewWordsSoundingLike(req.body.name) },
      { where: { id: req.body.id } }
    )
    res.status(200)
  } else res.status(404)
  return res.send()
})

router.delete('/:id', async (req, res) => {
  const model = await (await sequelizeModel).Model.findOne({ where: { id: req.params.id } })
  if (model) {
    model.destroy()
    res.status(200)
  } else res.status(404)
  return res.send()
})

export default router
