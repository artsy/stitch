import React from "react"
import path from "path"
import { keys, merge, omit } from "lodash"
import { stitch } from "../"

describe("src/stitch", () => {
  const config = (options = {}) => {
    return merge(
      {
        basePath: path.join(__dirname, "fixtures"),
        layout: "templates/layout.ejs",
        blocks: {
          head: "templates/head.ejs",
          body: () => <div />,
        },
        data: {
          title: "Basic Example",
          subTitle: "Hello from React!",
        },
      },
      options
    )
  }

  describe("#stitch", () => {
    it("throws if no layout file is provided", async () => {
      console.error = jest.fn()
      await expect(stitch(omit(config(), "layout"))).rejects.toBeDefined()
    })

    it("returns rendered html", async () => {
      const html = await stitch(config())
      expect(typeof html).toEqual("string")
      expect(html).toMatch("Basic Example")
    })

    it("accepts a `basePath` for modifying root file locations", async () => {
      const html = await stitch(
        config({
          basePath: __dirname,
          layout: "fixtures/templates/layout.ejs",
          blocks: {
            head: "fixtures/templates/head.ejs",
          },
        })
      )

      expect(html).toMatch("Basic Example")
    })

    it("accepts a `locals` object for local express data", async () => {
      const name = "Hello how are you"

      const html = await stitch(
        config({
          locals: {
            name,
          },
        })
      )

      expect(html).toMatch(name)
    })

    it("accepts a `data` object for component / app data", async () => {
      const name = "Hello how are you"

      const html = await stitch(
        config({
          data: {
            name,
          },
          blocks: {
            body: props => {
              expect(props.name).toMatch(name)

              return <div />
            },
          },
        })
      )

      expect(html).toMatch(name)
    })

    describe("accepts a `blocks` object for nested layouts", () => {
      const jadeProp = "Lets render a .jade template"

      it("can be a path to a template", async () => {
        const html = await stitch(
          config({
            blocks: {
              body: "templates/body.jade",
            },
            data: {
              jadeProp,
            },
          })
        )

        expect(html).toMatch(jadeProp)
      })

      it("can be a React component", async () => {
        const html = await stitch(
          config({
            blocks: {
              body: props => {
                expect(props.jadeProp).toMatch(jadeProp)
                return <div>{props.jadeProp}</div>
              },
            },
            data: {
              jadeProp,
            },
          })
        )

        expect(html).toMatch(jadeProp)
      })

      it("throws if none of the above", async () => {
        await expect(
          stitch(
            config({
              blocks: {
                foo: [],
                bar: {},
                baz: "aklsjdfalskdjflaksjdfk",
              },
            })
          )
        ).rejects.toBeDefined()
      })
    })

    describe("accepts a `templates` object", () => {
      it("can be a path to a template", async () => {
        const html = await stitch(
          config({
            blocks: {
              body: props => {
                const {
                  templates: { pugTemplate },
                } = props

                expect(pugTemplate).toMatch("<div>testing pug template</div>")

                return (
                  <section
                    dangerouslySetInnerHTML={{
                      __html: pugTemplate,
                    }}
                  />
                )
              },
            },
            templates: {
              pugTemplate: "templates/body.pug",
            },
          })
        )

        expect(html).toMatch("<div>testing pug template</div>")
      })

      it("can be a React component", async () => {
        const html = await stitch(
          config({
            blocks: {
              body: props => {
                const {
                  templates: { reactComponent },
                } = props

                return (
                  <section
                    dangerouslySetInnerHTML={{
                      __html: reactComponent,
                    }}
                  />
                )
              },
            },
            templates: {
              reactComponent: () => <div>hello world</div>,
            },
          })
        )

        expect(html).toMatch("hello world")
      })

      it("throws if none of the above", async () => {
        await expect(
          stitch(
            config({
              templates: {
                foo: [],
              },
            })
          )
        ).rejects.toBeDefined()
      })

      it("returns a `templates` object containing rendered html by key", async done => {
        await stitch(
          config({
            blocks: {
              body: ({ templates }) => {
                expect(keys(templates)).toEqual(["foo", "bar", "baz"])

                done()
                return <div />
              },
            },
            templates: {
              foo: () => <div />,
              bar: () => <div />,
              baz: () => <div />,
            },
          })
        )
      })
    })
  })
})
