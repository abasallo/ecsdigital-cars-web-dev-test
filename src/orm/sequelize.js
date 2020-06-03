import 'dotenv/config'

import Sequelize from 'sequelize'

import { initializeModel } from './model'

export const connectWithOptions = (dbDialect, dbPath, dbPoolMax, dbPoolMin, dbPoolIdle) => {
  return new Sequelize({
    dialect: dbDialect,
    storage: dbPath,
    pool: { max: parseInt(dbPoolMax), min: parseInt(dbPoolMin), idle: parseInt(dbPoolIdle) },
    logging: false,
  })
}

const sequelize = (() => {
  return connectWithOptions(
    process.env.DATABASE_DIALECT,
    process.env.DATABASE_PATH,
    process.env.DATABASE_POOL_MAX,
    process.env.DATABASE_POOL_MIN,
    process.env.DATABASE_POOL_IDLE
  )
})()

export const initSequelize = async () => {
  const model = await initializeModel(await sequelize)
  await sequelize.sync()
  return model
}

export const closeSequelize = () => sequelize.close()
