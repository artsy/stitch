import App from './components/App'
import express from 'express'
import { stitch } from '@artsy/stitch'

const app = module.exports = express()

app.get('/backbone', async (req, res, next) => {
  try {
    const layout = await stitch({
      basePath: __dirname,
      layout: 'templates/layout.pug',
      blocks: {
        head: 'templates/meta.pug',
        body: App
      },
      data: {
        title: 'Backbone',
        description: 'Templates can be precompiled and passed to components for mounting on client. Open console and click buttons; logging is coming from UsersView.js, a Backbone component.'
      },
      templates: {
        users: 'templates/users.pug'
      }
    })

    res.send(layout)
  } catch (error) {
    console.log(error)
  }
})
