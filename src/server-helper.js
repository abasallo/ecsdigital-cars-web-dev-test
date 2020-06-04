import express from 'express'

import cors from 'cors'

import bodyParser from 'body-parser'

import HttpStatus from 'http-status-codes'

import routes from './routes'

import { initSequelize } from './orm/sequelize'

import swaggerUI from 'swagger-ui-express'
import swaggerDoc from '../swagger.json'

export const model = initSequelize()

export const server = express()

server.use(cors())

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.use((err, req, res, next) => {
  const BAD_REQUEST = HttpStatus.BAD_REQUEST
  if (err instanceof SyntaxError && err.status === BAD_REQUEST && 'body' in err) {
    console.error(err)
    return res.sendStatus(BAD_REQUEST)
  }
  next()
})

server.use('/make', routes.make)
server.use('/model', routes.model)
server.use('/car', routes.car)

server.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
