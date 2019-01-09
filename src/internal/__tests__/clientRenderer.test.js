import React from "react"
import { serverRenderer } from "../serverRenderer"
import { clientRenderer } from "../clientRenderer"

describe("clientRenderer", () => {
  it("returns a mountOnClient function that when called rehydrates client", () => {
    const modules = {
      Foo: () => <div>foo</div>,
      Bar: () => <div>bar</div>,
      Baz: ({ name }) => <div>{name}</div>,
    }

    const renderQueue = []

    const { components: serverSide } = serverRenderer({
      modules,
      serialize: component => {
        renderQueue.push(component)
      },
    })

    serverSide.Foo()
    serverSide.Bar()
    serverSide.Baz()

    const { components: clientSide, mount } = clientRenderer({
      modules,
    })

    clientSide.Foo = jest.fn()
    clientSide.Bar = jest.fn()
    clientSide.Baz = jest.fn()

    renderQueue.forEach(block => {
      mount(block)
    })

    expect(clientSide.Foo).toHaveBeenCalled()
    expect(clientSide.Bar).toHaveBeenCalled()
    expect(clientSide.Baz).toHaveBeenCalled()
  })
})
