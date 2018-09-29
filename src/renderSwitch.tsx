import React, { ComponentClass } from "react"
import ReactDOM from "react-dom/server"
import { Block } from "./render"
import { RenderLayoutOptions } from "./renderLayout"
import { StitchConfig } from "./renderLayout"
import { renderTemplate } from "./renderTemplate"
import { isComponent, isTemplate } from "./utils"

type RenderSwitchOptions = Pick<
  RenderLayoutOptions,
  "basePath" | "config" | "data" | "locals" | "templates"
>

export async function renderSwitch(
  block: Block,
  options: RenderSwitchOptions
): Promise<{ html: string; css: string }> {
  let html = ""
  let css = ""

  if (!block) {
    return { html, css }
  }

  const {
    basePath = process.cwd(),
    data = {},
    locals = {},
    templates = {},
  } = options

  const config: StitchConfig = {
    componentRenderer: ReactDOM.renderToString,
    styledComponents: false,
    ...options.config,
  }

  if (isTemplate(block)) {
    html = await renderTemplate(block, {
      basePath,
      locals: {
        ...locals,
        ...data,
        ...templates,
      },
    })
  } else if (isComponent(block)) {
    const props = { ...data, locals, templates }
    const isReact = config.componentRenderer === ReactDOM.renderToString

    if (isReact) {
      const Component = block as ComponentClass<any>

      if (config.styledComponents) {
        const { ServerStyleSheet } = require("styled-components")
        const sheet = new ServerStyleSheet()

        html = config.componentRenderer(
          sheet.collectStyles(<Component {...props} />)
        )

        css = sheet.getStyleTags()
      } else {
        html = config.componentRenderer(<Component {...props} />)
      }
    } else {
      html = config.componentRenderer((block as any)(props))
    }
  } else {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "@artsy/stitch: (lib/index) " +
          "Error rendering layout: `block` must be a template, React " +
          "component or string"
      )
    }
  }

  return { html, css }
}
