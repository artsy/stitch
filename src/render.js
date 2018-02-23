import renderSwitch from './renderSwitch'
import { isEmpty, isString, isObject } from 'lodash'

export default async function render (asset, options) {
  const isValid = isString(asset) || isObject(asset)

  if (!isValid) {
    throw new Error(
      '(@artsy/stitch: lib/render) ' +
        'Error rendering template: attempting to render something other than a ' +
        'string or an object.'
    )
  }

  if (isString(asset)) {
    try {
      const { html } = await renderSwitch(asset, options)
      return html
    } catch (error) {
      throwError(error)
    }
  } else {
    const keys = Object.keys(asset)

    try {
      const renderedBlocks = await Promise.all(
        keys.map(async (key) => {
          const { html, css } = await renderSwitch(asset[key], options)

          return {
            key,
            html,
            css
          }
        })
      )

      const blockMap = renderedBlocks.reduce(
        (blockMap, { key, html }) => ({
          ...blockMap,
          [key]: html
        }),
        {}
      )

      const css = renderedBlocks
        .filter(({ css }) => !isEmpty(css))
        .map(({ css }) => css)
        .join('')

      return [blockMap, css]
    } catch (error) {
      throwError(error)
    }
  }
}

const throwError = (error) => {
  console.error(error)
  throw new Error(error)
}
