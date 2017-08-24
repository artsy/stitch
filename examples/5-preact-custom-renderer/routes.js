import express from 'express'
import renderToString from 'preact-render-to-string'
import { renderLayout } from '@artsy/stitch'
import { h } from 'preact'
/** @jsx h */

const app = module.exports = express()

app.get('/', async (req, res) => {
  try {
    const layout = await renderLayout({
      layout: 'templates/layout.ejs',
      config: {
        componentRenderer: renderToString
      },
      blocks: {
        head: 'templates/head.ejs',
        body: (props) => {
          const { title, subtitle } = props

          return (
            <div>
              <h1>
                {title}
              </h1>
              <h3>
                {subtitle}
              </h3>
            </div>
          )
        }
      },
      data: {
        title: 'Preact / EJS Example',
        subtitle: 'Hello from Preact!'
      }
    })

    res.send(layout)
  } catch (error) {
    console.log(error)
  }
})
