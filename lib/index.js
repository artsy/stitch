import render from './render'

export async function renderLayout (options) {
  const {
    blocks = {},
    data = {},
    locals = {},
    layout,
    templates = {}
  } = options

  if (!layout) {
    throw new Error(
      '(@artsy/stitch: lib/index) ' +
      'Error rendering layout: A `layout` file is required.'
    )
  }

  const renderedTemplates = await render(templates, options)
  const renderedBlocks = await render(blocks, { ...options, templates: renderedTemplates })
  const renderedHtml = await render(layout, {
    ...options,
    locals: {
      ...locals,
      ...renderedBlocks,
      data: {
        ...data,
        templates: renderedTemplates
      }
    }
  })

  return renderedHtml
}
