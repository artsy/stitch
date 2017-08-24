import App from './components/App'
import express from 'express'
import { renderLayout } from '@artsy/stitch'

const app = module.exports = express()

app.get('/', async (req, res) => {
  try {
    const layout = await renderLayout({
      layout: 'templates/layout.handlebars',
      blocks: {
        body: App
      },
      data: {
        title: 'Handlebars Example',
        subtitle: 'Hello from React!'
      }
    })

    res.send(layout)
  } catch (error) {
    console.log(error)
  }
})
