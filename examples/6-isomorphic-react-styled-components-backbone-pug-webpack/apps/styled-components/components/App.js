import React from 'react'
import styled from 'styled-components'

const Layout = styled.div`
  background: rgb(233, 255, 205);
  border: 1px solid black;
  height: 200px;
  padding: 50px;
`

export default function App (props, context) {
  const { title } = props

  return (
    <Layout>
      <h3>
        {title}
      </h3>
      <p>
        Hello from Styled Components!
      </p>
    </Layout>
  )
}
