import cons from "consolidate"
import { isArray, isFunction } from "lodash"
import path from "path"
import { ComponentClass } from "react"
import { Block } from "./render"
import { RenderLayoutOptions } from "./renderLayout"

type RenderTemplateOptions = Pick<
  RenderLayoutOptions,
  "basePath" | "locals" | "config"
>

export async function renderTemplate(
  block: Block,
  options: RenderTemplateOptions = {}
): Promise<string> {
  const {
    basePath = process.cwd(),
    locals = {},
    config = {
      engines: {},
    },
  } = options

  try {
    const rendered = isArray(block)
      ? await Promise.all(block.map(compile))
      : await compile(block)

    return rendered
  } catch (error) {
    throw new Error(`(@artsy/stitch: lib/renderTemplate) ${error.message}`)
  }

  async function compile(file) {
    const ext = path.extname(file).replace(".", "")

    const compileFn = config.engines[ext] || cons[ext]

    if (!isFunction(compileFn)) {
      throw new Error(
        "(@artsy/stitch: lib/renderTemplate) " +
          `Error rendering block with extension ${ext}: Can only render ` +
          "templates supported by https://www.npmjs.com/package/consolidate."
      )
    }

    const filePath = path.join(basePath, file)

    try {
      const html = await compileFn(filePath, locals)

      // FIXME: Why does consolidate mutate locals?
      delete (locals as any).filename

      return html
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
