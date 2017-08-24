import path from 'path'
import renderTemplate from '../renderTemplate'

describe('lib/renderTemplate', () => {
  it('renders a single template if template is not an array', async () => {
    const title = 'hey'

    const html = await renderTemplate('templates/head.ejs', {
      basePath: path.join(__dirname, 'fixtures'),
      locals: {
        title
      }
    })

    expect(html).toMatch(title)
  })

  it('renders an array of templates if template is an array', async () => {
    const title = 'hey'
    const jadeProp = 'hi jade'

    const templates = await renderTemplate([
      'templates/head.ejs',
      'templates/body.jade'
    ], {
      basePath: path.join(__dirname, 'fixtures'),
      locals: {
        title,
        jadeProp
      }
    })

    expect(templates[0]).toMatch(title)
    expect(templates[1]).toMatch(jadeProp)
  })

  it('throws if template filename is not supported by consolidate', async () => {
    await expect(renderTemplate('foo.alskdfjskdlfjakjl')).rejects.toBeDefined()
  })
})
