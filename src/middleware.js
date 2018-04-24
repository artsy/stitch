import { componentRenderer } from './componentRenderer'

export function middleware(modules) {
  return (_req, res, next) => {
    const renderQueue = []

    const { components } = componentRenderer({
      mode: 'server',
      modules,
      serialize: component => {
        renderQueue.push(component)
      }
    })

    res.locals.stitch = {
      components
    }

    res.locals.sharify.data.stitch = {
      renderQueue
    }

    next()
  }
}
