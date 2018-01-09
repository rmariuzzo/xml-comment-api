const fs = require('fs')
const path = require('path')
const XmlCommentApi = require('..')

describe('replace method', () => {

  it('should replace contents with new contents', () => {
    const xml = XmlCommentApi('<!-- TEST --> 👾 <!-- /TEST -->')
    xml.replace('TEST', (tag) => ' 👾👾 ')
    expect(xml.contents()).toBe('<!-- TEST --> 👾👾 <!-- /TEST -->')
  })

  it('should replace contents with new contents (in multiple tags)', () => {
    const xml = XmlCommentApi('<!-- TEST --> 👾 <!-- /TEST --> <!-- TEST --> 👾 <!-- /TEST -->')
    xml.replace('TEST', (tag, i) => ` 👾👾 ${i} `)
    expect(xml.contents()).toBe('<!-- TEST --> 👾👾 0 <!-- /TEST --> <!-- TEST --> 👾👾 1 <!-- /TEST -->')
  })

  it('should replace contents with new contents (in multiple tags with different lengths)', () => {
    const xml = XmlCommentApi('<!-- TEST --><!-- /TEST --> <!-- TEST --><!-- /TEST --> <!-- TEST --><!-- /TEST -->')
    xml.replace('TEST', (tag, i) => ` ${'a'.repeat(i + 1)} `)
    expect(xml.contents()).toBe('<!-- TEST --> a <!-- /TEST --> <!-- TEST --> aa <!-- /TEST --> <!-- TEST --> aaa <!-- /TEST -->')
  })

  it('should not accept a callback returning non-string', () => {
    const xml = XmlCommentApi('<!-- TEST --> 👾 <!-- /TEST -->')
    expect(() => xml.replace('TEST', () => new Date)).toThrow()
  })

  it('should replace contents with new contents (using string as callback)', () => {
    const xml = XmlCommentApi('<!-- TEST --> 👾 <!-- /TEST -->')
    xml.replace('TEST', ' 👾👾 ')
    expect(xml.contents()).toBe('<!-- TEST --> 👾👾 <!-- /TEST -->')
  })

  it('should prevent wrong type of callback', () => {
    const xml = XmlCommentApi('<!-- TEST --> 👾 <!-- /TEST -->')
    expect(() => xml.replace('TEST', new Date)).toThrow()
    expect(() => xml.replace('TEST', {})).toThrow()
    expect(() => xml.replace('TEST', 123)).toThrow()
    expect(() => xml.replace('TEST', true)).toThrow()
  })

})
