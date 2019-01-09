import { ComponentClass, SFC } from "react"

export interface SerializableComponent {
  /**
   * A DOM ID for components to mount to. During server-side pass this ID is
   * dynamically created and passed to the client via sharify, which hydrates
   * and attaches a component to.
   *
   * If using client-side templates only, this id must be manually passed to
   * the component at runtime.
   */
  mountId: string

  /** The name of the module. Typically corresponded to a named module export */
  moduleName: string

  /** Props to pass to the component */
  props: object
}

export interface MiddlewareConfig {
  /** A map of component modules to render */
  modules: Components

  /** An optional wrapper component to wrap a rendered component */
  wrapper?: ComponentWrapper

  /** Callback function containing serialized component data  */
  serialize?: (component: SerializableComponent) => void
}

export type Component = ComponentClass | SFC
export type ComponentWrapper = (props) => JSX.Element

export interface Components {
  [name: string]: Component
}
