import cons from "consolidate"
import { isFunction } from "lodash"
import path from "path"
import { Engine, StitchConfig } from "./index"
import { Block } from "./render"

export function isTemplate(
  filePath: string,
  engines?: StitchConfig["engines"]
): boolean {
  return !!getCompileFn(filePath, engines)
}

export function getCompileFn(
  filePath: string,
  engines?: StitchConfig["engines"]
): Engine | undefined {
  const ext = path.extname(filePath).slice(1)
  return (engines && engines[ext]) || cons[ext]
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
