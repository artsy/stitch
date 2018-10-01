import { NextFunction, Request, Response } from "express"
import { ComponentClass } from "react"
import { componentRenderer } from "./componentRenderer"
import { RenderMode, SerializableComponent } from "./componentRenderer"

/**
 * TODO: Document new Stitch functionality
 */

export interface Modules {
  /** A map of component modules to serialize */
  [name: string]: ComponentClass<any>
}

export function middleware(modules: Modules) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const renderQueue: SerializableComponent[] = []

    const { components } = componentRenderer({
      mode: RenderMode.SERVER,
      modules,
      serialize: (component: SerializableComponent) => {
        renderQueue.push(component)
      },
    })

    res.locals.stitch = {
      components,
    }

    // Sharify will safely expose the sharify.data and sd globals to the
    // client-side for the convenience of rehydrating across server/client.
    // See: https://github.com/artsy/sharify
    //
    // TODO: Implement in more generic way and document functionality
    res.locals.sharify.data.stitch = {
      renderQueue,
    }

    next()
  }
}
