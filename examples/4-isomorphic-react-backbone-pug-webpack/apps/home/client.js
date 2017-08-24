import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

const bootstrapData = window.__BOOTSTRAP__

ReactDOM.render(
  <App {...bootstrapData} />, document.getElementById('react-root')
)

if (module.hot) {
  module.hot.accept()
}
