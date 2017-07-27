const fs = require('fs')
const path = require('path')
const XmlCommentApi = require('..')

describe('find method', () => {

  it('should find existing tags (case sensitive)', () => {
    const tags = XmlCommentApi('<!-- TEST --> 👾 <!-- /TEST -->').find('TEST')
    expect(tags.length).toBe(1)
  })

  it('should find existing tags (case insensitive)', () => {
    const tags = XmlCommentApi('<!-- TEST --> 👾 <!-- /TEST -->').find('test', { insensitive: true })
    expect(tags.length).toBe(1)
  })

  it('should not find existing tags (with different case)', () => {
    const tags = XmlCommentApi('<!-- TEST --> 👾 <!-- /TEST -->').find('test')
    expect(tags.length).toBe(0)
  })

  it('should find multiple tags', () => {
    const tags = XmlCommentApi('<!-- TEST --> 👾 hi <!-- /TEST --> <!-- TEST --> 👾 hello <!-- /TEST -->').find('TEST')
    expect(tags.length).toBe(2)
    expect(tags[0].contents).toBe(' 👾 hi ')
    expect(tags[1].contents).toBe(' 👾 hello ')
  })

  it('should skip malformed tags (double opening)', () => {
    const tags = XmlCommentApi('<!-- TEST --> <!-- TEST --> 👾 <!-- /TEST -->').find('TEST')
    expect(tags.length).toBe(1)
    expect(tags[0].contents).toBe(' 👾 ')
  })

  it('should skip malformed tags (close first)', () => {
    const tags = XmlCommentApi('<!-- /TEST --> <!-- TEST --> 👾 <!-- /TEST -->').find('TEST')
    expect(tags.length).toBe(1)
    expect(tags[0].contents).toBe(' 👾 ')
  })

  it('should find existing tags with attributes', () => {
    const tags = XmlCommentApi('<!-- TEST(name:rubens,age:99) --> 👾 <!-- /TEST -->').find('TEST')
    expect(tags.length).toBe(1)
    expect(Object.keys(tags[0].attributes).length).toBe(2)
    expect(tags[0].attributes.name).toBe('rubens')
    expect(tags[0].attributes.age).toBe('99')
  })

  it('should find existing tags with attributes (shortcut attributes)', () => {
    const tags = XmlCommentApi('<!-- TEST(alive) --> 👾 <!-- /TEST -->').find('TEST')
    expect(tags.length).toBe(1)
    expect(Object.keys(tags[0].attributes).length).toBe(1)
    expect(tags[0].attributes.alive).toBe(true)
  })

})
