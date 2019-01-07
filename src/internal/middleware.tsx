import { NextFunction, Request, Response } from "express"
import { serverRenderer } from "./serverRenderer"
import { MiddlewareConfig, SerializableComponent } from "./types"

/**
 * Modules passed into middleware are then pushed into sharify, under `stitch`,
 * for rehydration on the client.
 */
export function middleware({ modules, wrapper }: MiddlewareConfig) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const renderQueue: SerializableComponent[] = []

    const { components } = serverRenderer({
      modules,
      serialize: (component: SerializableComponent) => {
        renderQueue.push(component)
      },
      wrapper,
    })

    res.locals.stitch = {
      components,
    }
    res.locals.sharify.data.stitch = {
      renderQueue,
    }

    next()
  }
}
