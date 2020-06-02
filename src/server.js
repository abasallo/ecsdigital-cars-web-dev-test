import 'dotenv/config'

import { app } from './server-helper'

app.listen(3000, () => console.log(`ecsdigital-cars-web-dev-test server running on port: ${process.env.PORT}!`))
