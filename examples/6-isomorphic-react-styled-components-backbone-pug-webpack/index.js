require('babel-core/register')

const config = require('./webpack.config')
const express = require('express')
const logger = require('artsy-morgan')
const path = require('path')
const webpack = require('webpack')
const { createReloadable } = require('@artsy/express-reloadable')

const app = express()
const compiler = webpack(config)

app.set('views', 'templates')
app.use(express.static('public'))
app.use(logger)

// Webpack / HMR
app.use(require('webpack-hot-middleware')(compiler))
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  serverSideRender: true,
  stats: {
    colors: true
  }
}))

const mountAndReload = createReloadable(app, require)

// Apps
app.use(mountAndReload(path.resolve(__dirname, 'apps/home')))
app.use(mountAndReload(path.resolve(__dirname, 'apps/backbone')))
app.use(mountAndReload(path.resolve(__dirname, 'apps/styled-components')))

app.listen(3000, () => {
  console.log('Listening on port 3000.')
})
