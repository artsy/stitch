import React from "react"
import ReactDOM from "react-dom"
import { MiddlewareConfig, SerializableComponent } from "./types"

/**
 * Iterates over the sharify `renderQueue` and attaches a rehydrated and rendered
 * component at its mountId attach point.
 */
export function clientRenderer({
  wrapper: Wrapper = ({ children }) => children,
  modules,
}: MiddlewareConfig) {
  const components = Object.entries(modules).reduce(
    (moduleMap, [moduleName, Module]: any[]) => {
      const Component = (props: Partial<SerializableComponent> = {}) => {
        setTimeout(() => {
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
          ReactDOM.hydrate(
            <Wrapper>
              <Module {...props} />
            </Wrapper>,
            mountPoint
          )
        }, 0)
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

    /**
     * Executed when the client mounts
     */
    mount: ({ moduleName, ...component }: SerializableComponent) => {
      // Call the component with props, which triggers a render
      components[moduleName]({
        mountId: component.mountId,
        ...component.props,
      })
    },
  }
}
