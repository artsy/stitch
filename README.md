# @artsy/stitch

[![Build Status](https://travis-ci.com/artsy/stitch.svg?token=gy99gfdxXxqG3ydmn6xq&branch=master)](https://travis-ci.com/artsy/stitch)

Helps your Component and Template dependencies peacefully coexist

### Overview

At Artsy we have a number of Node.js applications that have been in production for a while. [Force](https://github.com/artsy/force), for example, was built when CoffeeScript and Jade made a lot of sense; CoffeeScript fixed many of the problems with JavaScript pre-ES6, and Jade made working with HTML much more elegant. As time progressed and new technologies became a thing these solutions starting feeling more burdensome to continue building features with and many of our developers longed to start using next-generation tools like React.js. But how? Short of a rebuild, which resource constraints often prohibit, merging old and new tech can be difficult, particularly on the view layer.

This library is an attempt to help those making incremental transitions away from templating solutions like Jade, EJS and [numerous others](https://github.com/tj/consolidate.js), towards React (or other [React-like libs](https://github.com/developit/preact)). What it does is provide a flexible set of conventions for dealing with layout code typically seen in Express, but will work just about anywhere that raw HTML is sent down the wire to the client.

If you're using a templating library supported by [consolidate.js](https://github.com/visionmedia/consolidate.js), this library could be useful to you.

### Installation

```sh
yarn install @artsy/stitch
```

### Example Scenarios / Who This Library is Aimed At

- Your UI is built in Jade/Pug or other layout based-engines, and you use "block" functionality. How to inject React components into each while maintaining backwards compatibility?
- Alternatively, you use a templating library that relies on server-side includes. How to do the same?
- The bulk of your app is built in Backbone, with each view backed by a Handlebars template. You'd still like to use your existing views / UI while incrementally migrating sections towards React. How to "render" each Backbone view inside of your React components -- or vice versa?
- You've got a server-side-rendered, EJS-based app and you'd like to start taking advantage of React's isomorphic "universal" rendering. How to go about rendering React components on the server and then rehydrating them on the client?
- You've got a new app built entirely in React but for one reason or another need to keep portions of the layout isolated from one another.
- ...

Out of the box, Stitch aims for flexibility.

## Usage

**Table of Contents**

- [Basic Example](#basic)
- [Express.js](#expressjs-and-pug)
- [Layouts and complex UI](#layouts-and-other-complex-ui-configurations)
- [Isomorphic / "Universal" Rendering](#isomorpic-or-universal-rendering)
- [Precompiling templates](#precompiling-templates)
- [Preact and other custom renderers](#custom-renderers)
- [`<StyledComponents />` support](#styled-components-support)
- [Full API](#full-api)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

(If you want to jump right in, see the [full example project](https://github.com/artsy/stitch/tree/master/examples/6-isomorphic-react-styled-components-backbone-pug-webpack).)

#### Basic Example

In its most basic form, this library is a single function that accepts a path to your layout, some data, and returns a stitched-together string of rendered, raw html that can be sent to the client:

```html
<div>
  {{title}}
</div>
```

```js
const html = await stitch({
  layout: "templates/layout.handlebars",
  data: {
    title: "Hello!",
  },
})

console.log(html)

// => Outputs:
/*
<div>
  Hello!
</div>
*/
```

By adding "blocks" you can begin assembling more complex layouts. Blocks represent either a path to a template or a function / React class that returns a string:

```html
// templates/layout.handlebars

<html>
  <head>
    <title>
      {{title}}
    </title>
  </head>
  <body
    {{{body}}}
  </body>
</html>
```

```js
// index.js

const html = await stitch({
  layout: "templates/layout.handlebars",
  data: {
    title: "Hello World!",
  },
  blocks: {
    body: props => {
      return <h1>{props.title}</h1>
    },
  },
})

console.log(html)

// => Outputs:
/*
<html>
  <head>
    <title>Hello World!</title>
  </head>
  <body>
    <h1>
      Hello World!
    </h1>
  </body>
</html>
*/
```

You can add as many blocks as you need, which are accessible by key. Each block is evaluated and compiled, and then injected into the layout. Keep in mind that any field that accepts a path to a template can also accept a component (as either a Class or a stateless functional component), and template formats can be mixed and matched. This allows for a great amount of flexibility within seemingly incompatible view systems.

#### Express.js and Pug

**NOTE!** Each of the following use [async / await](https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016), which is available by default in Node >= 7.6.0. If your environment doesn't yet support async / await see the [Troubleshooting](#troubleshooting) section below for an example that uses ES6 Promises.

```js
// index.js

import express from "express"
import { stitch } from "@artsy/stitch"

import Body from "./components/Body"
import Footer from "./components/Footer"

const app = express()

app.get("/", async (req, res, next) => {
  try {
    const html = await stitch({
      layout: "templates/mainLayout.pug",
      data: {
        title: "Hello World!",
        description:
          "An example showing how to take a view structure based in .pug and interpolate with React",
      },
      blocks: {
        head: "templates/head.pug",
        body: Body,
        footer: Footer,
      },
    })

    res.send(html)
  } catch (error) {
    next(error)
  }
})

app.listen(3000, () => {
  console.log("Listening on port 3000.")
})
```

```pug
//- templates/mainLayout.pug

html
  head
    != head
  body
    != body

    footer
      != footer
```

```pug
//- templates/head.pug

title= title
meta( property='og:title', content= title )
meta( name='description', content= description )
```

```js
// components/Body.js

export default function Body({ title, description }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
```

```js
// components/Footer.js

export default function Footer() {
  return <h4>Hello footer!</h4>
}
```

#### Layouts and other complex UI configurations

Where this system really begins to shine is when there is a base layout that is extended by sub-layouts. For example, say you have an Express app that mounts a number of sub-apps, and each sub-app has its own layout that "extends" the main layout using blocks (or includes, etc):

```pug
//- templates/mainLayout.pug

html
  head
    include partials/head
    block head

  body
    include partials/body
    block body
```

```pug
//- apps/home/templates/homeLayout.pug

extends ../../../templates/mainLayout.pug

block head
  != head

block body
  if locals.isAuthenticated
    div
      | Logged-in

  != body
```

```js
// apps/home/routes.js

...

const html = await stitch({
  basePath: __dirname,
  layout: 'templates/homeLayout.pug',
  data: {
    title: 'Hello how are you?',
    description: 'Views extending views extending views...'
  },

  // Can also define locals, which are passed down to components under
  // the `props.locals` key
  locals: {
    isAuthenticated: req.locals.userIsAuthenticated
  },
  blocks: {
    head: 'templates/head.pug',
    body: Body
  }
})

res.send(html)
```

#### Isomorpic (or "Universal") rendering

This is covered in more depth in the [isomorphic-react-pug-webpack example](https://github.com/artsy/stitch/tree/master/examples/6-isomorphic-react-styled-components-backbone-pug-webpack) but in short, since the `data` object is injected into the template before rendering takes place, making it available on the client is as easy as `JSON.stringifying` it:

```pug
// - templates/layout.pug

html
  body
    script.
      var __BOOTSTRAP__ = {JSON.stringify(data)}

    != app
```

```js
const html = await stitch({
  layout: "templates/layout.pug",
  blocks: {
    app: App,
  },
  data: {
    name: "Z",
  },
})

res.send(html)
```

```js
export default class App extends Component {
  componentDidMount () {
    console.log(`Hello ${this.props.name}, <App /> is mounted on the client.`)
  },

  render () {
    return (
      <div>
        Hello {this.props.name}
      </div>
    )
  }

}
```

```js
// client.js

React.render(<App {...window.__BOOTSTRAP__} />)
```

#### Precompiling Templates

What to do if you have a bunch of old-school Backbone views that you don't want to throw out while moving over to React, but would still like to inject their markup _into_ your React app for mounting later on the client? This library makes that easy:

```js
// apps/login/index.js

...

const html = await stitch({
  layout: 'templates/loginLayout.pug',
  blocks: {
    app: App
  },
  templates: {
    login: 'templates/login.pug'
  }
})
```

```js
// components/Body.js

import React from "react"
import Login from "./Login"

export default function App(props) {
  const {
    templates: { login },
  } = props

  return (
    <div>
      <Login template={login} />
    </div>
  )
}
```

```js
// components/Login.js

import React, { Component } from 'react'
import LoginView from '../views/LoginView'

export default class Login extends Component {
  componentDidMount () {
    this.loginView = new LoginView()
    this.loginView.render()
  }

  componentWillUnmount () {
    this.loginView.remove()
  }

  render () {
    return (
      <div>
        <div dangerouslySetInnerHtml={{
          __html: this.props.template
        }}>
      </div>
    )
  }
}
```

```html
// templates/login.handlebars

<div id='login'>
  <button>
    Login
  </button>
</div>
```

```js
// views/LoginView.js

var LoginView = Backbone.View.extend({
  el: '#login',

  events: {
    'click button': 'handleLoginClick'
  },

  handleLoginClick: function () {
    ...
  },

  render: function() {
    ...
  }
})

module.exports = LoginView
```

The template is precompiled, and the html is available from within your React components to mount and unmount as necessary under the `props.templates` key.

#### Custom Renderers

If you would prefer to use a rendering engine other than React, no problem -- just pass in a custom render function that returns a string:

```js
import renderToString from "preact-render-to-string"

const html = await stitch({
  layout: "templates/loginLayout.pug",
  config: {
    componentRenderer: renderToString,
  },
  blocks: {
    body: App,
  },
})
```

Additionally, if you would like to override any default template engines (e.g., what is returned by `require('handlebars')`) you can do so by updating `config.engines`:

```js
const html = await stitch({
  layout: "templates/loginLayout.pug",
  config: {
    engines: {
      handlebars: (filePath, locals) => {
        return customHandlebarsRenderer(filePath, locals)
      },
      pug: (filePath, locals) => {
        return customPugRenderer(filePath, locals)
      },
    },
  },
  blocks: {
    body: App,
  },
})
```

#### Styled Components Support

If your React app uses [`styled-components`](https://www.styled-components.com/), ensure you've installed [babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components) and enable server-side rendering via config:

```js
import styled from "styled-components"

const html = await stitch({
  layout: "templates/layout.pug",
  config: {
    styledComponents: true,
  },
  blocks: {
    body: props => {
      const Layout = styled.div`
        background: purple;
        border: 1px solid black;
        color: white;
        width: 100%;
      `

      return <Layout>Hello Styled Components!</Layout>
    },
  },
})
```

Lastly, make sure to mount your styles in your layout template:

```pug
html
  head
    != css

  body
    #react-root
      != body
```

## Full API

```js
const html = await stitch({

  /**
   * Sets a base path from which to fetch templates.
   *
   * @type {String}
   */
  basePath: process.cwd(),

  /**
   * Path to layout template file / component.
   *
   * @type {String|Component}
   */
  layout: <REQUIRED>

  /**
   * Block sections to pass to template / components. A "block" typically
   * represents a discreet section (header, body, footer, etc) but can be
   * anything.
   */
  blocks: {
    /**
     * @type {String|Component}
     */
  },

  /**
   * Locals represent Express.js locals as they flow through the `req` / `res`
   * cycle. These values could be passed to the following section, `data`, but
   * for the sake of clarity and isolation they're typically passed along here.
   *
   * Accessible from within components via `props.locals` and from within a
   * template via `locals`
   */
  locals: {
    /**
     * @type {*}
     */
  },

  /**
   * Data that is passed to templates and components. Embedded directly
   * within template code, but also accessible via `data` (useful for
   * JSON.stringify'ing and passing down the wire for rehydration). In a
   * component, it represents `props` and is accessible as such.
   */
  data: {
    /**
     * @type {*}
     */
  },

  /**
   * Templates / Components that are precompiled and passed along as rendered
   * html strings. From within your component, template html is accessible via
   * `props.templates`
   */
  templates: {
    /**
     * @type {String|Component}
     */
  },

  config: {

    /**
     * Configuration for layout renderer. Right now components are rendered via
     * ReactDOM, but any kind of engine can be passed in and accommodated
     * assuming it returns a string of rendered markup.
     *
     * @type {Function}
     */
    componentRenderer: ReactDOM.renderToString,

    /**
     * If you would like to override any default template engines pass in a
     * key matching the extension and a function, e.g.,
     *
     * engines: {
     *   pug: (filePath, locals) => string
     * }
     */
    engines: {
      /**
       * @type {Function}
       */
    },

    /**
     * If your project uses <StyledComponents /> and you would like to extract
     * styles from your component during server-side renders, set this to true.
     *
     * See https://www.styled-components.com/docs/advanced#server-side-rendering
     * for more information.
     *
     * @type {Boolean}
     */
    styledComponents: false
  }
})
```

## Troubleshooting

> Help! My view doesn't render and there's an `Unexpected token (` in my console.

All of the examples assume that you've enabled [async / await](https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016), which comes by default in versions of Node >= `7.6.0`. If you're getting this error, it's likely you're using an older version that doesn't yet support this feature. But no fear - async / await is just a wrapper around Promises:

```js
stitch({ layout: "layout.ejs" })
  .then(html => {
    res.send(html)
  })
  .catch(error => {
    next(error)
  })
```

> Async / await is supported in my version of Node, but I'm not seeing anything in the browser and no errors in the console!

Did you remember to use the `await` keyword before `stitch`? It's easy to forget :)

## Development

### Commits and Deployments

This project uses [auto-release](https://github.com/intuit/auto-release#readme) to automatically release on every PR. Every PR should have a label that matches one of the following

- Version: Trivial
- Version: Patch
- Version: Minor
- Version: Major

No release will happen on a `Trivial` update.
