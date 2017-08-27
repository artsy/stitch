require('babel-core/register')

const express = require('express')
const app = express()

app.use(require('./routes'))

app.listen(3000, () => {
  console.log('Listening on port 3000.')
})
