import React from "react"
import path from "path"
import { render } from "../render"
import { keys } from "lodash"

describe("lib/render", () => {
  it("throws if `asset` is not a string or an object", async () => {
    console.error = jest.fn()
    await expect(render()).rejects.toBeDefined()
  })

  it("returns an html string if `asset` is a string", async () => {
    const title = "hello how are you"

    const html = await render("templates/head.ejs", {
      basePath: path.join(__dirname, "fixtures"),
      data: {
        title,
      },
    })

    expect(html).toMatch(title)
  })

  it("returns an object containing html by key", async () => {
    const name = "K"
    const age = "1000"

    const [displayObj] = await render(
      {
        name: "templates/name.jade",
        age: props => <div>{props.age}</div>,
      },
      {
        basePath: path.join(__dirname, "fixtures"),
        data: {
          name,
          age,
        },
      }
    )

    expect(keys(displayObj)).toEqual(["name", "age"])
    expect(displayObj.name).toMatch(name)
    expect(displayObj.age).toMatch(age)
  })
})
