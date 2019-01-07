#### SSR Middleware

Since it's not always an option to start building pages from scratch, Artsy needed a mechanism for taking existing Jade components and stitching in new React components. Using express-based middleware, we provide Stitch with a map of modules that can be rendered on the server and rehydrated on the client, all from within existing template code.

**NOTE:** This implementation is tied closely to Artsy's needs and should be considered an undocumented API. It uses [Sharify](https://github.com/artsy/sharify) to pass data between the client and server.

First, create a few React modules that you'd want accessible throughout your template code:

```js
// modules.js

export const Header = props => <header>Hello</header>
export const Footer = props => <footer>World</footer>
```

Then mount the middleware to your Express server:

```js
// server.js
import * as modules from "./modules"
import { middleware } from "@artsy/stitch/dist/internal/middleware"

const app = express()

// Note that this assumes that sharify is configured, and is accessible via the
// `res.locals.sd` local variable.
app.use(middleware({ modules }))
```

If you need to wrap each component (with a ContextProvider, for example) an optional `wrapper` can be passed in:

```js
app.use(middleware({
  modules
  wrapper: ({ children }) => (
    <ContextProvider>
      {children}
    </ContextProvider>
  )
}))
```

Lastly, rehydrate on the client:

```js
// client.js

import { rehydrate } from "@artsy/stitch/dist/internal/rehydrate"
import * as modules from "./modules"
import { data as sharifyData } from "sharify"

rehydrate({
  modules,
  sharifyData,
})
```

Once these pieces are configured, you can now access react components via template code:

```jade
// myTemplate.jade

.header
  != stitch.components.Header()

.footer
  != stitch.components.Footer()
```

If for whatever reason the template is **only** rendered client-side, ensure that the template has access to the sharify instance and pass in a `mountId` as props:

```js
import myTemplate from "./templates/myTemplate.jade"

$("body").html(
  myTemplate({
    stitch: sharifyData.stitch,
  })
)
```

```jade
// myTemplate.jade

.footer
  #stitch-mount
    != stitch.components.Header({ mountId: 'stitch-mount' })
```

Since there isn't the server-side pass to dynamically generate the surrounding mount point, it needs to be created during runtime and the ID passed into the component.

### How it works

When running on the server `serverRenderer` reads in an array of modules, grabs the name, creates a serializable map of what components need to be rehydrated on the client, and then pushes those components into a renderQueue. This queue is managed by Sharify, Artsy's library for sharing data across the server / client divide. (See https://github.com/artsy/sharify for more info.) Finally it renders the markup and returns it as static html.

When running client-side, Stitch reads the renderQueue from sharify and rehydrates, pushing the rendered components back onto `sharify.stitch.components` so that they can be called from client-side code. It does this by looking for a dynamically generated id that has been attached to the server-rendered DOM node.
