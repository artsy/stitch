import ReactDOM from "react-dom/server"
import { StitchOptions } from "./index"
import { render } from "./render"

export async function renderLayout(options: StitchOptions) {
  const {
    layout,
    blocks = {},
    config = {
      componentRenderer: ReactDOM.renderToString,
      engines: {},
      styledComponents: false,
    },
    data = {},
    locals = {},
    templates = {},
  } = options

  if (!layout) {
    throw new Error(
      "(@artsy/stitch: lib/renderLayout) " +
        "Error rendering layout: A `layout` file is required."
    )
  }

  const [renderedTemplates] = await render(templates, options)
  const [renderedBlocks, css] = await render(blocks, {
    ...options,
    templates: renderedTemplates,
  })
  const layoutHtml = await render(layout, {
    ...options,
    locals: {
      ...locals,
      ...(renderedBlocks as object),
      css,
      data: {
        ...data,
        templates: renderedTemplates,
      },
    },
  })

  return layoutHtml
}
