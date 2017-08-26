import React, { Component } from 'react'
import Users from './Users'

export default function User ({ template }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: template
      }}
    />
  )
}
