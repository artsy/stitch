import renderTemplate from './renderTemplate'
import { isComponent, isTemplate } from './utils'
import ReactDOM from 'react-dom/server'

export default async function renderSwitch (block, options) {
  let html = ''

  if (!block) {
    return html
  }

  const {
    basePath = process.cwd(),
    data = {},
    locals = {},
    templates = {},
    config = {
      componentRenderer: ReactDOM.renderToString
    }
  } = options

  if (isTemplate(block)) {
    html = await renderTemplate(block, {
      basePath,
      locals: {
        ...locals,
        ...data,
        ...templates
      }
    })
  } else if (isComponent(block)) {
    const props = { ...data, locals, templates }
    const isReact = config.componentRenderer === ReactDOM.renderToString

    if (isReact) {
      block = require('react').createElement(block, props)
      html = config.componentRenderer(block)
    } else {
      html = config.componentRenderer(block(props))
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        '@artsy/stitch: (lib/index) ' +
        'Error rendering layout: `block` must be a template, React ' +
        'component or string'
      )
    }
  }

  return html
}
