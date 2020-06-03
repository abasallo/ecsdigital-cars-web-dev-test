import 'dotenv/config'

import { model, server } from './server-helper'

const DEFAULT_PORT = 3000 // TODO - Extract to common constant holder

model
  .then(() => console.log('ecsdigital-cars-web-dev-test database initialised.'))
  .catch((error) => console.error(`ecsdigital-cars-web-dev-test database initialisation error: ${error}`))

server.listen(process.env.PORT || DEFAULT_PORT, () =>
  console.log(`ecsdigital-cars-web-dev-test server running on port: ${process.env.PORT || DEFAULT_PORT}.`)
)
