import ReactDOM from 'react-dom/server'
import render from './render'

export async function renderLayout (options) {
  const {
    layout,
    blocks = {},
    config = {
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

  const [renderedTemplates] = await render(templates, options)
  const [renderedBlocks, css] = await render(blocks, {
    ...options,
    templates: renderedTemplates
  })
  const renderedHtml = await render(layout, {
    ...options,
    locals: {
      ...locals,
      ...renderedBlocks,
      css,
      data: {
        ...data,
        templates: renderedTemplates
      }
    }
  })

  return renderedHtml
}
