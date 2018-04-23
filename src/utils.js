import { isFunction, isString } from 'lodash'

export function isTemplate(template) {
  if (!isString(template)) {
    return false
  }

  const BLACKLIST = ['.js', '.jsx', '.ts', '.tsx']

  const found = BLACKLIST.some(extension => template.includes(extension))
  return !found
}

export function isComponent(Component) {
  if (isFunction(Component)) {
    return true
  } else {
    throw new Error(
      '(@artsy/stitch: lib/utils) ' +
        'Error rendering layout: Invalid component.'
    )
  }
}
