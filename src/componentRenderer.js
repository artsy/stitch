import React from 'react'
import ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server'
import { uniqueId } from 'lodash'

import {
  ServerStyleSheet,
  __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS
} from 'styled-components'

// For Jest. See: https://github.com/styled-components/styled-components/issues/1692
const { StyleSheet } = __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS
StyleSheet.reset(true)

const modes = {
  CLIENT: 'client',
  SERVER: 'server'
}

export function componentRenderer(config) {
  const {
    mode = modes.SERVER,
    modules,
    serialize = x => x
    //
  } = config

  const components = Object.keys(modules).reduce((moduleMap, moduleName) => {
    const Component = modules[moduleName]

    return {
      ...moduleMap,

      [moduleName]: props => {
        if (mode === modes.SERVER) {
          const mountId = uniqueId('stitch-component-')
          const sheet = new ServerStyleSheet()
          const html = renderToString(
            sheet.collectStyles(<Component {...props} />)
          )
          const css = sheet.getStyleTags()
          const markup = `
            <div id=${mountId}>
              ${css}
              ${html}
            </div>
          `.trim()

          serialize({ mountId, moduleName, props })
          return markup

          // Client
        } else if (mode === modes.CLIENT) {
          setTimeout(() => {
            ReactDOM.hydrate(
              <Component {...props} />,
              document.getElementById(props.mountId)
            )
          }, 0)
        }
      }
    }
  }, {})

  return {
    components,
    mountOnClient: ({ moduleName, ...props }) => {
      components[moduleName](props)
    }
  }
}
