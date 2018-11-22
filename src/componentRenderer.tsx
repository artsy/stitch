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
  Wrapper: (props) => JSX.Element
}

export function componentRenderer(config: ComponentRendererConfig) {
  const {
    modules,
    mode = RenderMode.SERVER,
    serialize,
    Wrapper = ({ children }) => children,
  } = config

  const components = Object.keys(modules).reduce((moduleMap, moduleName) => {
    const Module = modules[moduleName]
    const getComponent = () => props => {
      return (
        <Wrapper>
          <Module {...props} />
        </Wrapper>
      )
    }

    return {
      ...moduleMap,

      [moduleName]: (props: { mountId?: string } = {}) => {
        if (mode === RenderMode.SERVER) {
          const mountId = props.mountId || uniqueId("stitch-component-")
          const sheet = new ServerStyleSheet()
          const Component = getComponent()
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
            serialize({
              mountId,
              moduleName,
              props,
            })
          }

          return markup

          // Client
        } else if (mode === RenderMode.CLIENT) {
          setImmediate(() => {
            if (!props.mountId) {
              console.error(
                "[@artsy/stitch] Error mounting clientside component: `mountId` is " +
                  "undefined. Did you forget to pass in a `mountId` in as a prop?"
              )
            }

            const mountPoint = document.getElementById(props.mountId)
            if (!mountPoint) {
              console.error(
                "[@artsy/stitch] Error mounting client-side component: Element not " +
                  `found for #id '${
                    props.mountId
                  }'. Did you forget to create a ` +
                  "DOM node to mount react to?"
              )
            }
            const Component = getComponent()
            ReactDOM.hydrate(<Component {...props} />, mountPoint)
          })
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
