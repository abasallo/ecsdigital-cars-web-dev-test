import express from 'express'

import cors from 'cors'

import bodyParser from 'body-parser'

import routes from './routes'

import { initSequelize } from './orm/sequelize'

export const model = initSequelize()

export const server = express()

server.use(cors())

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.use('/make', routes.make)
server.use('/model', routes.model)
server.use('/car', routes.car)
