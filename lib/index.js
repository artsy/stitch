import ReactDOM from 'react-dom/server'
import render from './render'
import { flatten } from 'lodash'

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

  const [
    templateHtml,
    templateCSS
  ] = await render(templates, options)

  const [
    blockHtml,
    blockCSS
  ] = await render(blocks, {
    ...options,
    templates: templateHtml
  })

  const css = flatten(templateCSS.concat(blockCSS)).join('\n')

  const [renderedHtml] = await render(layout, {
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
