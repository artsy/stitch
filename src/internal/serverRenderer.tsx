import { uniqueId } from "lodash"
import React from "react"
import { renderToString } from "react-dom/server"
import { ServerStyleSheet } from "styled-components"
import { MiddlewareConfig, SerializableComponent } from "./types"

/**
 * Iterate over components passed via middleware and perform a server-side render
 * pass, and store a serializable representation of the component in sharify for
 * client-side rehydration.
 */
export function serverRenderer({
  wrapper: Wrapper = ({ children }) => children,
  modules,
  serialize,
}: MiddlewareConfig) {
  const components = Object.entries(modules).reduce(
    (moduleMap, [moduleName, Module]: any[]) => {
      const Component = (props: Partial<SerializableComponent> = {}) => {
        const mountId = props.mountId || uniqueId("stitch-component-")
        const sheet = new ServerStyleSheet()
        const html = renderToString(
          sheet.collectStyles(
            <Wrapper>
              <Module {...props} />
            </Wrapper>
          )
        )
        const css = sheet.getStyleTags()
        const markup = `<div id="${mountId}">${css}${html}</div>`.trim()

        // If provided, callback with a serializable component definition. This
        // data is then passed to the client as JSON stored in a renderQueue which
        // rehydrates the component on client-side mount.
        if (serialize) {
          serialize({ mountId, moduleName, props })
        }

        return markup
      }

      return {
        ...moduleMap,
        [moduleName]: Component,
      }
    },
    {}
  )

  return {
    components,
  }
}
