import Consolidate from "consolidate"
import ReactDOM from "react-dom/server"
import { Block, render } from "./render"

export interface StitchConfig {
  /** Custom renderToString-like component renderer */
  componentRenderer?: (props) => string

  /** A map of custom render engines */
  engines?: {
    [name: string]: (filePath, locals) => string
  }

  /** Enable styled-components support */
  styledComponents: false
}

export interface RenderLayoutOptions {
  /** The basePath from which to look up template files */
  basePath?: string

  /** Path to layout file */
  layout: string

  /** Blocks represent a renderable component */
  blocks?: {
    [name: string]: Block
  }

  /** Stitch configuration */
  config?: StitchConfig

  /** Data to pass to components as props */
  data?: object

  /** Data to pass to Express as locals */
  locals?: object

  /** Templates to inject in as components */
  templates?: {
    /**
     * Paths to templates to pass on to compiler
     */
    [name: string]: string
  }
}

export async function renderLayout(options: RenderLayoutOptions) {
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
