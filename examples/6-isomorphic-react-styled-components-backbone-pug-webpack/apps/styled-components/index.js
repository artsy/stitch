import App from './components/App'
import express from 'express'
import { renderLayout } from '@artsy/stitch'

const app = module.exports = express()

app.get('/styled-components', async (req, res, next) => {
  try {
    const layout = await renderLayout({
      basePath: __dirname,
      layout: 'templates/layout.pug',
      config: {
        styledComponents: true
      },
      blocks: {
        head: 'templates/meta.pug',
        body: App
      },
      data: {
        title: 'Styled Components'
      }
    })

    res.send(layout)
  } catch (error) {
    next(error)
  }
})
