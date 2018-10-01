import React from "react"
import { middleware } from "../middleware"

const modules = {
  Foo: () => <div>foo</div>,
  Bar: () => <div>bar</div>,
  Baz: ({ name }) => <div>{name}</div>,
}

describe("middleware", () => {
  it("mounts a stitch object to `res.locals`", () => {
    const next = jest.fn()
    const req = {}
    const res = {
      locals: {
        stitch: {},
        sharify: {
          data: {
            stitch: {},
          },
        },
      },
    }

    const stitchMiddleware = middleware(modules)
    stitchMiddleware(req, res, next)
    const { components } = res.locals.stitch
    expect(Object.keys(components)).toEqual(["Foo", "Bar", "Baz"])
    expect(next).toHaveBeenCalled()
  })

  it("mounts SSR data for the client under `sharify.data.stitch`", () => {
    const next = jest.fn()
    const req = {}
    const res = {
      locals: {
        stitch: {},
        sharify: {
          data: {
            stitch: {},
          },
        },
      },
    }

    const stitchMiddleware = middleware(modules)
    stitchMiddleware(req, res, next)
    const { components } = res.locals.stitch
    const { renderQueue } = res.locals.sharify.data.stitch

    components.Foo({ name: "Foo" })
    components.Bar({ name: "Bar" })
    components.Baz({ name: "Baz" })

    renderQueue.forEach(({ moduleName, mountId, props }) => {
      expect(mountId).toMatch(/stitch-component-\d/)
      expect(moduleName).toEqual(props.name)
    })

    expect(next).toHaveBeenCalled()
  })
})
