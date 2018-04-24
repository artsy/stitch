import React from 'react'
import styled from 'styled-components'
import { componentRenderer } from '../componentRenderer'

const modules = {
  Foo: () => <div>foo</div>,
  Bar: () => <div>bar</div>,
  Baz: ({ name }) => <div>{name}</div>
}

describe('componentRenderer', () => {
  describe('server-side', () => {
    it('returns mapped components', () => {
      const { components } = componentRenderer({
        mode: 'server',
        modules
      })

      expect(Object.keys(components)).toEqual(['Foo', 'Bar', 'Baz'])
    })

    it('renders component html', () => {
      const renderQueue = []

      const { components } = componentRenderer({
        mode: 'server',
        modules
      })

      expect(components.Foo()).toContain('foo')
      expect(components.Bar()).toContain('bar')
      expect(components.Baz({ name: 'baz' })).toContain('baz')
    })

    it('injects DOM id mount points', () => {
      const { components } = componentRenderer({
        mode: 'server',
        modules
      })

      expect(components.Foo()).toContain('id=stitch-component-')
    })

    it('renders component css', () => {
      const Wrapper = styled.div`
        background-color: purple;
      `

      const { components } = componentRenderer({
        mode: 'server',
        modules: {
          Wrapper
        }
      })

      expect(components.Wrapper()).toContain('background-color:purple;')
    })

    it('creates unique id for each render', () => {
      const { components } = componentRenderer({
        mode: 'server',
        modules
      })

      const [foo] = components.Foo().match(/stitch-component-\d/)
      const [bar] = components.Bar().match(/stitch-component-\d/)
      const [baz] = components.Baz().match(/stitch-component-\d/)

      expect(foo !== bar).toBe(true)
      expect(foo !== baz).toBe(true)
      expect(bar !== foo).toBe(true)
      expect(bar !== baz).toBe(true)
      expect(baz !== foo).toBe(true)
      expect(baz !== bar).toBe(true)
    })

    it('serializes itself to be passed to the client', () => {
      const renderQueue = []

      const { components } = componentRenderer({
        mode: 'server',
        modules,
        serialize: component => {
          renderQueue.push(component)
        }
      })

      components.Foo({ name: 'Foo' })
      components.Bar({ name: 'Bar' })
      components.Baz({ name: 'Baz' })

      renderQueue.forEach(({ mountId, moduleName, props }) => {
        expect(mountId).toMatch(/stitch-component-\d/)
        expect(moduleName).toEqual(props.name)
      })
    })
  })

  describe('client-side', () => {
    it('returns a mountOnClient function that when called rehydrates client', () => {
      const renderQueue = []

      const { components: serverSide } = componentRenderer({
        mode: 'server',
        modules,
        serialize: component => {
          renderQueue.push(component)
        }
      })

      serverSide.Foo()
      serverSide.Bar()
      serverSide.Baz()

      const { components: clientSide, mountOnClient } = componentRenderer({
        mode: 'server',
        modules
      })

      clientSide.Foo = jest.fn()
      clientSide.Bar = jest.fn()
      clientSide.Baz = jest.fn()

      renderQueue.forEach(block => {
        mountOnClient(block)
      })

      expect(clientSide.Foo).toHaveBeenCalled()
      expect(clientSide.Bar).toHaveBeenCalled()
      expect(clientSide.Baz).toHaveBeenCalled()
    })
  })
})
