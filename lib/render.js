import renderSwitch from './renderSwitch'
import { isEmpty, isString, isObject } from 'lodash'

export default async function render (aspect, options) {
  const isValid = isString(aspect) || isObject(aspect)

  if (!isValid) {
    throw new Error(
      '(@artsy/stitch: lib/render) ' +
      'Error rendering template: attempting to render something other than a ' +
      'string or an object.'
    )
  }

  if (isString(aspect)) {
    try {
      const { html, css } = await renderSwitch(aspect, options)
      return [ html, css ]
    } catch (error) {
      throwError(error)
    }
  } else {
    const keys = Object.keys(aspect)

    try {
      const renderedBlocks = await Promise.all(
        keys.map(async key => {
          const { html, css } = await renderSwitch(aspect[key], options)

          return {
            key,
            html,
            css
          }
        })
      )

      const blockMap = renderedBlocks
        .reduce((blockMap, { key, html }) => ({
          ...blockMap,
          [key]: html
        }), {})

      const css = renderedBlocks
        .filter(({ css }) => !isEmpty(css))
        .map(({ css }) => css)

      return [ blockMap, css ]
    } catch (error) {
      throwError(error)
    }
  }
}

const throwError = (error) => {
  throw new Error(error)
}
