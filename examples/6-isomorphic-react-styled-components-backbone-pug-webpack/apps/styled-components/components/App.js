import React, { Component } from 'react'
import styled from 'styled-components'

const Layout = styled.div`
  background: rgb(233, 255, 205);
  border: 1px solid black;
  height: 200px;
  padding: 50px;
`

export default class App extends Component {
  componentDidMount () {
    console.log('Component mounted on client-side')
  }

  handleButtonClick = () => {
    console.log('clicking button')
  }

  render () {
    const { title, subtitle } = this.props

    return (
      <Layout>
        <h3>
          {title}
        </h3>
        <h4>
          {subtitle}
        </h4>
        <p>
          Hello from Styled Components! Please view your source and open your console and <button onClick={this.handleButtonClick}>click here</button>
        </p>
      </Layout>
    )
  }
}
