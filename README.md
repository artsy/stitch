# @artsy/stitch

[![Build Status](https://travis-ci.com/artsy/stitch.svg?token=gy99gfdxXxqG3ydmn6xq&branch=master)](https://travis-ci.com/artsy/layout)

### Overview

At Artsy we have a number of Node.js applications that have been in production for a while. [Force](https://github.com/artsy/force), for example, was built when CoffeeScript and Jade made a lot of sense; CoffeeScript fixed many of the problems with JavaScript pre-ES6, and Jade made working with HTML much more elegant. As time progressed and new technologies became a thing these solutions starting feeling more burdensome to continue building features with and many of our developers longed to start using next-generation tools like React.js. But how? Short of a rebuild, which resource constraints often prohibit, merging old and new tech can be difficult, particularly on the view layer.

This library is an attempt to help those making incremental transitions away from templating solutions like Jade, EJS and [numerous others](https://github.com/tj/consolidate.js), towards React (or other [React-like libs](https://github.com/developit/preact)). What it does is provide a flexible set of conventions for dealing with layout code typically seen in Express, but will work just about anywhere that raw HTML is sent down the wire to the client.

If you're using a templating library supported by [consolidate.js](https://github.com/visionmedia/consolidate.js), this library could be useful to you.

### Installation

```sh
yarn install @artsy/stitch
```

### Who This Library is Aimed At / Example Scenarios
- Your UI is built in Jade/Pug or other layout based-engines, and you use "block" functionality. How to inject React components into each while maintaining backwards compatibility?
- Alternatively, you use a templating library that relies on server-side includes. How to do the same?
- The bulk of your app is built in Backbone, with each view backed by a Handlebars template. You'd still like to use your existing views / UI while incrementally migrating sections towards React. How to "render" each Backbone view inside of your React components -- or vice versa?
- You've got a server-side-rendered, EJS-based app and you'd like to start taking advantage of React's isomorphic "universal" rendering. How to go about rendering React components on the server and then rehydrating them on the client?

Usage
-----

**Table of Contents**

- [Basic Example](#basic)
- [Express.js](#expressjs-and-pug)
- [Layouts and complex UI](#layouts-and-other-complex-ui-configurations)
- [Precompiled templates](#precompiling-templates)
- [Isomorphic / "Universal" Rendering](#isomorpic-or-universal-rendering)
- [Preact and other custom renderers](#custom-renderers)
- [Full API](#full-api)

#### Basic Example

In its most basic form, this library is a single function that accepts a path to your layout, a few "blocks" representing either paths to templates or React components, some data, and returns a stitched-together string of rendered, raw html that can be sent to the client:

```html
// templates/layout.handlebars

<html>
  <head>
    <title>
      {{title}}
    </title>
  </head>
  <body>
    {{body}}
  </body>
</html>
```

```js
// index.js

const html = await renderLayout({
  layout: 'templates/layout.handlebars',
  blocks: {
    body: (props) => {
      return (
        <h1>
          {props.title}
        </h1>
      )
    }
  },
  data: {
    title: 'Hello World!',
  }
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


#### Express.js and Pug

And a slightly more complex example:

**NOTE:** Any field that accepts a path to a template can also accept a component, and template formats can be mixed and matched.

```js
// index.js

import express from 'express'
import { renderLayout } from '@artsy/stitch'

import Body from './components/Body'
import Footer from './components/Footer'

const app = express()

app.get('/', async (req, res, next) => {
  try {
    const html = await renderLayout({
      layout: 'templates/mainLayout.pug',
      blocks: {
        head: 'templates/head.pug',
        body: Body,
        footer: Footer
      },
      data: {
        title: 'Hello World!',
        description: 'An example showing how to take a view structure based in .pug and interpolate with React'
      }
    })

    res.send(html)
  } catch (error) {
    next(error)
  }
})

app.listen(3000, () => {
  console.log('Listening on port 3000.')
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

export default function Body (props) {
  const { title, description } = this.props

  return (
    <div>
      <h3>
        {title}
      </h3>
      <p>
        {description}
      </p>
    </div>
  )
}
```

```js
// components/Footer.js

export default function Footer () {
  return (
    <h4>
      Hello footer!
    </h4>
  )
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
  if isAuthenticated
    div
      | Logged-in

  != body
```

```js
// apps/home/routes.js

...

app.get('/home', async (req, res, next) => {
  try {
    const html = await renderLayout({
      basePath: __dirname,
      layout: 'templates/homeLayout.pug',
      blocks: {
        head: 'templates/head.pug',
        body: Body
      },
      data: {
        title: 'Hello how are you?',
        description: 'Views extending views extending views...'
      },

      // Can also pass along locals, which is passed along to components under
      // the `props.locals` key to keep things isolated
      locals: {
        isAuthenticated: req.locals.userIsAuthenticated
      }
    })

    res.send(html)
  } catch (error) {
    next(error)
  }
})

```

Two last examples!

#### Precompiling Templates

What to do if you have a bunch of old-school Backbone views that you don't want to throw out while moving over to React, but would still like to inject their markup _into_ your React app for mounting later on the client? This library makes that easy:

```js
// apps/login/index.js

...

app.get('/login', async (req, res, next) => {
  try {
    const html = await renderLayout({
      layout: 'templates/loginLayout.pug',
      blocks: {
        app: App
      },
      templates: {
        login: 'templates/login.pug'
      }
    })

    res.send(html)
  } catch (error) {
    next(error)
  }
})

```

```js
// components/Body.js

import React from 'react'
import Login from './Login'

export default function App (props) {
  const {
    templates: {
      login
    }
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
  <button class='login-btn'>
    Login
  </button>
</div>
```

```js
// views/LoginView.js

var LoginView = Backbone.View.extend({
  el: '#login',

  events: {
    '.login-btn': 'handleLoginClick'
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

#### Isomorpic (or "Universal") rendering

This is covered more in-depth in the [isomorphic-react-pug-webpack example](https://github.com/artsy/stitch/tree/master/examples/4-isomorphic-react-pug-webpack) but in short, since the `data` object is injected into the template before rendering takes place, making it available on the client is as easy as `JSON.stringifying` it:

```pug
// - templates/layout.pug

html
  body
    script.
      var __BOOTSTRAP__ = {JSON.stringify(data)}
```


```js
// client.js

React.render(
  <App {...window.__BOOTSTRAP__} />
)

```

#### Custom Renderers

If you would prefer to use a rendering engine other than React, no problem -- just pass in a custom render function that returns a string:

```js
import renderToString from 'preact-render-to-string'

const html = await renderLayout({
  layout: 'templates/loginLayout.pug',
  config: {
    componentRenderer: renderToString
  },
  blocks: {
    body: App
  }
})

```

Full API
--------

```js
const html = await renderLayout({

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
   *
   * @type {String|Component}
   */
  blocks: {},

  /**
   * Locals represent Express.js locals as they flow through the `req` / `res`
   * cycle. These values could be passed to the following section, `data`, but
   * for the sake of clarity and isolation they're typically passed along here.
   *
   * Accessible from within components via `props.locals` and from within a
   * template via `locals`
   *
   * @type {*}
   */
  locals: {},

  /**
   * Data that is passed to templates and components. Embedded directly
   * within template code, but also accessible via `data` (useful for
   * JSON.stringify'ing and passing down the wire for rehydration). In a
   * component, it represents `this.props` and is accessible as such.
   *
   * @type {*}
   */
  data: {},

  /**
   * Templates / Components that are precompiled and passed along as rendered
   * html strings. From within your component, template html is accessible via
   * `props.templates`
   *
   * @type {String|Component}
   */
  templates: {},

  /**
   * Configuration for layout renderer. Right now components are rendered via
   * React, but any kind of engine can be passed in and accommodated assuming it
   * returns a string of rendered markup.
   *
   * @type {Object}
   */
  config: {
    componentRenderer: ReactDOM.renderToString
  }
})

```
