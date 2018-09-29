import { isFunction, isString } from "lodash"
import { Block } from "./render"

export function isTemplate(block: Block): boolean {
  if (!isString(block)) {
    return false
  }
  const BLACKLIST = [".js", ".jsx", ".ts", ".tsx"]
  const found = BLACKLIST.some(extension => block.includes(extension))
  return !found
}

export function isComponent(block: Block): boolean {
  if (isFunction(block)) {
    return true
  } else {
    throw new Error(
      "(@artsy/stitch: lib/utils) " +
        "Error rendering layout: Invalid component."
    )
  }
}
