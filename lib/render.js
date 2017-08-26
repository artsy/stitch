import renderSwitch from './renderSwitch'
import { isString, isObject } from 'lodash'

export default async function render (asset, options) {
  const isValid = isString(asset) || isObject(asset)

  if (!isValid) {
    throw new Error(
      '(@artsy/stitch: lib/render) ' +
      'Error rendering template: `asset` must be a string or an object.'
    )
  }

  if (isString(asset)) {
    try {
      const html = await renderSwitch(asset, options)
      return html
    } catch (error) {
      throwError(error)
    }
  } else {
    const keys = Object.keys(asset)

    try {
      const renderedBlocks = await Promise.all(
        keys.map(async key => {
          const html = await renderSwitch(asset[key], options)

          return [
            key,
            html
          ]
        })
      )

      const blockMap = renderedBlocks
        .reduce((blockMap, [key, html]) => ({
          ...blockMap,
          [key]: html
        }), {})

      return blockMap
    } catch (error) {
      throwError(error)
    }
  }
}

const throwError = (error) => {
  throw new Error(error)
}
