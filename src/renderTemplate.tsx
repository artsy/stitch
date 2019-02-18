import { isArray } from "lodash"
import path from "path"
import { StitchOptions } from "./index"
import { getCompileFn } from "./utils"

type RenderTemplateOptions = Pick<
  StitchOptions,
  "basePath" | "locals" | "config"
>

export async function renderTemplate(
  filePaths: string | string[],
  options: RenderTemplateOptions = {}
): Promise<string> {
  const { config, basePath = process.cwd() } = options

  try {
    const rendered = isArray(filePaths)
      ? await Promise.all(filePaths.map(compile)).then(res => res.join("\n"))
      : await compile(filePaths)

    return rendered
  } catch (error) {
    throw new Error(`(@artsy/stitch: lib/renderTemplate) ${error.message}`)
  }

  async function compile(filePath) {
    const absoluteFilePath = path.resolve(basePath, filePath)
    const compileFn = getCompileFn(absoluteFilePath, config && config.engines)

    // Consolidate mutates the `locals` input, so provide a copy or otherwise an
    // empty object if not locals were specified.
    const html = await compileFn(absoluteFilePath, { ...options.locals })

    return html
  }
}
