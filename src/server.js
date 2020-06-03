import 'dotenv/config'

import constants from './modules/constants'

import { model, server } from './server-helper'

model
  .then(() => console.log('ecsdigital-cars-web-dev-test database initialised.'))
  .catch((error) => console.error(`ecsdigital-cars-web-dev-test database initialisation error: ${error}`))

server.listen(process.env.PORT || constants.DEFAULT_PORT, () =>
  console.log(`ecsdigital-cars-web-dev-test server running on port: ${process.env.PORT || constants.DEFAULT_PORT}.`)
)
