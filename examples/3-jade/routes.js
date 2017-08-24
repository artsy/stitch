import App from './components/App'
import express from 'express'
import { renderLayout } from '@artsy/stitch'

const app = module.exports = express()

app.get('/', async (req, res) => {
  try {
    const layout = await renderLayout({
      layout: 'templates/layout.jade',
      blocks: {
        head: 'templates/head.jade',
        body: App
      },
      data: {
        title: 'Jade / Precompiled Templates Example',
        subtitle: 'Hello from React!'
      },
      locals: {
        description: 'And you can also pass along locals'
      },
      templates: {
        users: 'templates/users.jade'
      }
    })

    res.send(layout)
  } catch (error) {
    console.log(error)
  }
})
