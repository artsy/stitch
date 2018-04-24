import React, { Component } from 'react'
import { isTemplate, isComponent } from '../utils'

describe('lib/utils', () => {
  describe('#isTemplate', () => {
    it('returns true if template extension is not contained in blacklist', () => {
      expect(isTemplate('foo.pug')).toEqual(true)
    })

    it('returns false if template extension is contained in blacklist', () => {
      expect(isTemplate('bar.js')).toEqual(false)
      expect(isTemplate('bar.jsx')).toEqual(false)
      expect(isTemplate('bar.ts')).toEqual(false)
      expect(isTemplate('bar.tsx')).toEqual(false)
    })
  })

  describe('#isComponent', () => {
    it('returns true if Component is a react component', () => {
      class A extends Component {
        render() {
          return <div />
        }
      }

      const B = () => <div />

      expect(isComponent(A)).toEqual(true)
      expect(isComponent(B)).toEqual(true)
    })

    it('returns false if Component is not a react component', () => {
      expect(() => {
        isComponent('')
      }).toThrow()
    })
  })
})
