import React from "react"
import path from "path"
import { renderSwitch } from "../renderSwitch"

describe("src/renderSwitch", () => {
  it("returns a blank string if a block is not provided", async () => {
    const { html } = await renderSwitch(undefined)
    expect(html).toEqual("")
  })

  it("returns the input if block is a non-template string", async () => {
    const { html } = await renderSwitch("some-content", {})
    expect(html).toEqual("some-content")
  })

  it("returns rendered html if block is a template", async () => {
    const title = "hey"

    const { html } = await renderSwitch("templates/head.ejs", {
      basePath: path.join(__dirname, "fixtures"),
      data: {
        title,
      },
    })

    expect(html).toMatch(title)
  })

  it("returns rendered html if block is a React component", async () => {
    const title = "hey"
    const Title = props => <div>{props.title}</div>

    const { html } = await renderSwitch(Title, {
      basePath: path.join(__dirname, "fixtures"),
      data: {
        title,
      },
    })

    expect(html).toMatch(title)
  })

  it("throws if block is none of the above", async () => {
    await expect(renderSwitch([])).rejects.toBeDefined()
  })

  it("accepts a custom component render function", async () => {
    const title = "hey"
    const Title = props => `<div>${props.title}</div>`

    const { html } = await renderSwitch(Title, {
      basePath: path.join(__dirname, "fixtures"),
      config: {
        componentRenderer: x => x,
      },
      data: {
        title,
      },
    })

    expect(html).toMatch(title)
  })

  it("extracts styled-components if config.styledComponents = true", () => {
    // FIXME: https://github.com/styled-components/styled-components/issues/975
  })
})
