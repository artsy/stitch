require('babel-core/register')

const config = require('./webpack.config')
const express = require('express')
const webpack = require('webpack')
const { createReloadable } = require('@artsy/express-reloadable')

const app = express()
const mountAndReload = createReloadable(app, require)
const compiler = webpack(config)

app.set('views', 'templates')
app.use(express.static('public'))

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

// Apps
app.use(mountAndReload('./apps/home'))
app.use(mountAndReload('./apps/backbone'))

app.listen(3000, () => {
  console.log('Listening on port 3000.')
})
