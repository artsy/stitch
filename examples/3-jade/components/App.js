import React, { Component } from 'react'
import Users from './Users'

export default class App extends Component {
  render () {
    const {
      subtitle,
      locals: {
        description
      },
      templates: {
        users
      }
    } = this.props

    return (
      <div>
        <h3>
          {subtitle}
        </h3>
        <p>
          {description}
        </p>
        <h4>
          Templates can be precompiled and passed to components
        </h4>

        <Users
          template={users}
        />
      </div>
    )
  }
}
