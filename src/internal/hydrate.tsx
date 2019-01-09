import { clientRenderer } from "./clientRenderer"
import { Components, MiddlewareConfig, SerializableComponent } from "./types"

interface HydrateConfig extends MiddlewareConfig {
  sharifyData: {
    stitch: {
      renderQueue: SerializableComponent[]
      components: Components
    }
  }
}

/**
 * Called during client-side pass, this iterates over the components placed in
 * sharify's render queue and mounts them via React.hydrate. Components are
 * accessible via `sharify.stitch.components`.
 */
export function hydrate({ modules, sharifyData, wrapper }: HydrateConfig) {
  const { components, mount } = clientRenderer({
    modules,
    wrapper,
  })

  sharifyData.stitch.renderQueue.forEach(component => {
    mount(component)
  })

  // @ts-ignore FIXME: Type properly
  sharifyData.stitch.components = components
}
