import App from './components/App'
import express from 'express'
import { renderLayout } from '@artsy/stitch'

const app = module.exports = express()

app.get('/', async (req, res, next) => {
  try {
    const layout = await renderLayout({
      layout: 'templates/layout.ejs',
      blocks: {
        head: 'templates/head.ejs',
        body: App
      },
      data: {
        title: 'Basic EJS Example',
        subtitle: 'Hello from React!'
      }
    })

    res.send(layout)
  } catch (error) {
    next(error)
  }
})
