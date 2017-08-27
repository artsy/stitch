import ReactDOM from 'react-dom/server'
import render from './render'

export async function renderLayout (options) {
  const {
    layout,
    blocks = {},
    config = { // eslint-disable-line
      componentRenderer: ReactDOM.renderToString,
      engines: {},
      styledComponents: false
    },
    data = {},
    locals = {},
    templates = {}
  } = options

  if (!layout) {
    throw new Error(
      '(@artsy/stitch: lib/index) ' +
      'Error rendering layout: A `layout` file is required.'
    )
  }

  const [ templateHtml ] = await render(templates, options)
  const [ blockHtml, css ] = await render(blocks, { ...options, templates: templateHtml })
  const renderedHtml = await render(layout, {
    ...options,
    locals: {
      ...locals,
      ...blockHtml,
      css,
      data: {
        ...data,
        templates: templateHtml
      }
    }
  })

  return renderedHtml
}
