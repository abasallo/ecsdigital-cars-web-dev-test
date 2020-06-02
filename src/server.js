import 'dotenv/config'

import { app } from './server-helper'

const DEFAULT_PORT = 3000 // TODO - Extract to common constant holder

app.listen(3000, () => console.log(`ecsdigital-cars-web-dev-test server running on port: ${process.env.PORT || DEFAULT_PORT}!`))
