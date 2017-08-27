import React from 'react'
import express from 'express'
import styled from 'styled-components'
import { renderLayout } from '@artsy/stitch'

const app = module.exports = express()

app.get('/', async (req, res) => {
  try {
    const layout = await renderLayout({
      layout: 'templates/layout.ejs',
      config: {
        styledComponents: true
      },
      data: {
        title: '<StyledComponents /> Example'
      },
      blocks: {
        head: 'templates/head.ejs',
        body: (props) => {
          const { title } = props

          const Button = styled.button`
            font-size: 30px
          `

          return (
            <div>
              <h1>
                {title}
              </h1>
              <Button>
                Hi!
              </Button>
            </div>
          )
        },
        users: (props) => {
          const Layout = styled.div`
            background: purple;
            border: 1px solid black;
            color: white;
            padding: 30px;
          `

          return (
            <Layout>
              Hello from layout
            </Layout>
          )
        }
      }
    })

    res.send(layout)
  } catch (error) {
    console.log(error)
  }
})
