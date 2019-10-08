import path from "path"
import { renderTemplate } from "../renderTemplate"
import consolidate from "consolidate"

describe("src/renderTemplate", () => {
  it("renders a single template if template is not an array", async () => {
    const title = "hey"

    const html = await renderTemplate("templates/head.ejs", {
      basePath: path.join(__dirname, "fixtures"),
      locals: {
        title,
      },
    })

    expect(html).toMatch(title)
  })

  it("renders an array of templates if template is an array", async () => {
    const title = "hey"
    const jadeProp = "hi jade"

    const html = await renderTemplate(
      ["templates/head.ejs", "templates/body.jade"],
      {
        basePath: path.join(__dirname, "fixtures"),
        locals: {
          title,
          jadeProp,
        },
      }
    )

    expect(html).toMatch(title)
    expect(html).toMatch(jadeProp)
  })

  it("throws if template filename is not supported by consolidate", async () => {
    await expect(renderTemplate("foo.alskdfjskdlfjakjl")).rejects.toBeDefined()
  })

  it("allows for template compiler overrides via `config.engines[key]`", async () => {
    const title = "hey"
    const description = "now"

    const output = (name, description) => `
      <div>
        Hello ${name}, ${description}
      </div>
    `

    const html = await renderTemplate("templates/head.ejs", {
      basePath: path.join(__dirname, "fixtures"),
      locals: {
        title,
      },
      data: {
        description,
      },
      config: {
        engines: {
          ejs: (filePath, locals) => {
            return output({ ...locals })
          },
        },
      },
    })

    expect(html).toMatch(output({ name, description }))
  })

  it("tells the underlying render engine to cache", async () => {
    const _jade = consolidate.jade
    consolidate.jade = jest.fn()
    try {
      await renderTemplate(["templates/body.jade"], {
        basePath: path.join(__dirname, "fixtures"),
        locals: {
          jadeProp: "Be cached",
        },
      })
      expect(consolidate.jade).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({ cache: true })
      )
    } finally {
      consolidate.jade = _jade
    }
  })
})
