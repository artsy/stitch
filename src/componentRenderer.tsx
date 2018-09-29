import { uniqueId } from "lodash"
import React from "react"
import ReactDOM from "react-dom"
import { renderToString } from "react-dom/server"
import { ServerStyleSheet } from "styled-components"
import { Modules } from "./middleware"

/**
 * TODO: Document new Stitch functionality
 */

export enum RenderMode {
  CLIENT = "client",
  SERVER = "server",
}

export interface SerializableComponent {
  /** If rendering on the client a dom ID to attach the module to */
  mountId: string

  /** Name of the module */
  moduleName: string

  /** Props to pass to the module */
  props: object
}

interface ComponentRendererConfig {
  modules: Modules
  mode: RenderMode
  serialize: (component: SerializableComponent) => void
}

export function componentRenderer(config: ComponentRendererConfig) {
  const { modules, mode = RenderMode.SERVER, serialize } = config

  const components = Object.keys(modules).reduce((moduleMap, moduleName) => {
    const Component = modules[moduleName]

    return {
      ...moduleMap,

      [moduleName]: (props: { mountId?: string } = {}) => {
        if (mode === RenderMode.SERVER) {
          const mountId = props.mountId || uniqueId("stitch-component-")
          const sheet = new ServerStyleSheet()
          const html = renderToString(
            sheet.collectStyles(<Component {...props} />)
          )
          const css = sheet.getStyleTags()
          const markup = `
            <div id="${mountId}">
              ${css}
              ${html}
            </div>
          `.trim()

          if (serialize) {
            serialize({ mountId, moduleName, props })
          }

          return markup

          // Client
        } else if (mode === RenderMode.CLIENT) {
          setTimeout(() => {
            ReactDOM.hydrate(
              <Component {...props} />,
              document.getElementById(props.mountId)
            )
          }, 0)
        }
      },
    }
  }, {})

  return {
    components,
    mountOnClient: ({ moduleName, ...component }: SerializableComponent) => {
      components[moduleName]({
        mountId: component.mountId,
        ...component.props,
      })
    },
  }
}
