import { Block } from "./render"

export type Engine = (
  filePath: string,
  locals: { [key: string]: any }
) => string

export interface StitchConfig {
  /** Custom renderToString-like component renderer */
  componentRenderer?: (props) => string

  /** A map of custom render engines */
  engines?: {
    [name: string]: Engine
  }

  /** Enable styled-components support */
  styledComponents: boolean
}

export interface StitchOptions {
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

export { stitch } from "./stitch"
