"use strict";

const express = require('express')
const cookieParser = require('cookie-parser')
const routes = require('./routes.js')
const webapp = express()
const port = 39640

webapp.use(cookieParser())
webapp.use(express.json());
webapp.use('/', routes)

webapp.listen(port, () => {
  console.log(`Listening on port ${port}`)
})