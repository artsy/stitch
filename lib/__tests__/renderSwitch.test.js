import React from 'react'
import StyleSheet from 'styled-components/lib/models/StyleSheet'
import path from 'path'
import renderSwitch from '../renderSwitch'
import styled from 'styled-components'

// Hack to test StyledComponents in JSDom
StyleSheet.reset(true)

describe('lib/renderSwitch', () => {
  it('returns a blank string if a block is not provided', async () => {
    const { html } = await renderSwitch(undefined)
    expect(html).toEqual('')
  })

  it('returns rendered html if block is a template', async () => {
    const title = 'hey'

    const { html } = await renderSwitch('templates/head.ejs', {
      basePath: path.join(__dirname, 'fixtures'),
      data: {
        title
      }
    })

    expect(html).toMatch(title)
  })

  it('returns rendered html if block is a React component', async () => {
    const title = 'hey'
    const Title = (props) => <div>{props.title}</div>

    const { html } = await renderSwitch(Title, {
      basePath: path.join(__dirname, 'fixtures'),
      data: {
        title
      }
    })

    expect(html).toMatch(title)
  })

  it('throws if block is none of the above', async () => {
    await expect(renderSwitch([])).rejects.toBeDefined()
  })

  it('accepts a custom component render function', async () => {
    const title = 'hey'
    const Title = (props) => `<div>${props.title}</div>`

    const { html } = await renderSwitch(Title, {
      basePath: path.join(__dirname, 'fixtures'),
      config: {
        componentRenderer: (x) => x
      },
      data: {
        title
      }
    })

    expect(html).toMatch(title)
  })

  // it.only('extracts styledComponent styles when config.styledComponents = true', async () => {
  //   const Button = styled.button`
  //     background: black
  //   `
  //
  //   const Title = () => <Button>hello</Button>
  //
  //   const { html } = await renderSwitch(Title, {
  //     basePath: path.join(__dirname, 'fixtures'),
  //     config: {
  //       styledComponents: true
  //     }
  //
  //   })
  //
  //   // expect(html).toMatch('hello')
  // })
})
