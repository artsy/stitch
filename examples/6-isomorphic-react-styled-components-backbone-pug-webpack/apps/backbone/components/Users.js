import React, { Component } from 'react'
import UsersView from '../views/UsersView'

export default class Users extends Component {

  componentDidMount () {
    this.view = new UsersView()
    this.view.render()
  }

  componentWillUnmount () {
    this.view.remove()
  }

  render () {
    return (
      <div dangerouslySetInnerHTML={{
        __html: this.props.template }}
      />
    )
  }
}
