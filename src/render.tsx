import { isEmpty, isObject, isString } from "lodash"
import { ComponentClass } from "react"
import { StitchOptions } from "./index"
import { renderSwitch } from "./renderSwitch"

/** A Block represents a renderable asset type */
export type Block = ComponentClass<any> | string[] | string | object

export async function render(
  block: Block,
  options: StitchOptions
): Promise<string | any[]> {
  const isValid = isString(block) || isObject(block)

  if (!isValid) {
    throw new Error(
      "(@artsy/stitch: lib/render) " +
        "Error rendering template: attempting to render something other than a " +
        "string or an object."
    )
  }

  if (isString(block)) {
    try {
      const { html } = await renderSwitch(block, options)
      return html
    } catch (error) {
      throwError(error)
    }
  } else {
    const keys = Object.keys(block)

    try {
      const renderedBlocks = await Promise.all(
        keys.map(async key => {
          const { html, css } = await renderSwitch(block[key], options)

          return {
            css,
            html,
            key,
          }
        })
      )

      const blockMap = renderedBlocks.reduce(
        (blockMap, { key, html }) => ({ ...blockMap, [key]: html }),
        {}
      )

      const css = renderedBlocks
        .filter(({ css }) => !isEmpty(css))
        .map(({ css }) => css)
        .join("")

      return [blockMap, css]
    } catch (error) {
      throwError(error)
    }
  }
}

const throwError = error => {
  throw new Error(error)
}
