import React, { Component } from 'react'

export default class App extends Component {
  render () {
    const { title, subtitle } = this.props

    return (
      <div>
        <h1>
          {title}
        </h1>
        <h3>
          {subtitle}
        </h3>
      </div>
    )
  }
}
