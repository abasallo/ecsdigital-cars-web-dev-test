import 'dotenv/config'

import express from 'express'

const app = express()

app.get('/cars', (req, res) => res.send(`GET received on port: ${process.env.PORT} - cars endpoint`))

app.listen(3000, () => console.log(`Example app listening on port ${process.env.PORT}!`))
