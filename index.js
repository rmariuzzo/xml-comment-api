/**
 * @typedef {Object} FindOptions
 * @property {Boolean} insensitive - Indicate if the tag match should be case insensitive.
 */

/** @type {FindOptions} */
const defaultFindOptions = {
  insensitive: false,
}

/**
 * Return a comment API for a given xml.
 * @param {String} xml - The XML string contents.
 */
const XmlCommentApi = (xml) => {

  /** @type {String} */
  let _original = xml
  /** @type {String} */
  let _modified = xml

  return {
    /**
     * Find tags.
     * @param {String} name - The name of the tag.
     * @param {FindOptions} options - Options.
     * @return {Array}
     */
    find(name, options) {
      options = Object.assign({}, defaultFindOptions, options)

      // Create tag matcher with given options.
      const tagMatcherOptions = options.insensitive ? 'ig' : 'g'
      const tagMatcher = new RegExp(`<!-- ?(\/)?(${name})(\\(.+\\))? ?-->`, tagMatcherOptions)

      const tags = []

      // Find all possible open/close comment tags.
      let match, tag, attributes = {}
      let previousIndex

      while(match = tagMatcher.exec(_modified)) {
        const [, closingTag, matchedTag, matchedAttributes] = match
        const openingTag = !closingTag

        // Handle opening tag by capturing matched tag name and attributes.
        if (openingTag) {
          tag = matchedTag
          attributes = matchedAttributes && matchedAttributes
            .substring(1, matchedAttributes.length - 1)
            .split(/ *, */)
            .map((attr) => attr.split(/ *: */))
            .reduce((p, c) => {
              p[c[0]] = c.length > 1 ? c[1] : true
              return p
            }, {})
          previousIndex = tagMatcher.lastIndex
        }

        // Handle closing tag by capturing the contents, extra data and creating a tag object.
        else {
          // Skip first closed tag.
          if (previousIndex === undefined) continue

          tags.push({
            tag,
            attributes,
            contents: _modified.substring(previousIndex, match.index),
            start: previousIndex,
            end: match.index
          })
        }
      }

      return tags
    },

    /**
     * Find one or more tags and replace its contents using a callback.
     * @param {String} name - The name of the tag.
     * @param {FindOptions} options - The options.
     * @param {Function|String} callback - The callback.
     * @return {XmlCommentApi}
     */
    replace(name, options, callback) {

      // Support method overload.
      if (callback === undefined) {
        callback = options
        options = undefined
      }

      // Support string as callback.
      if (typeof callback === 'string') {
        const retValue = callback
        callback = () => retValue
      }

      // Ensure callback is a function.
      else if (typeof callback !== 'function') {
        throw new Error('The callback of the replace method should be a function.')
      }

      // We use an offset to handle multiple replacements.
      let offset = 0

      this.find(name, options)
        .forEach((tag, i) => {

          // Adjust offset for callback.
          tag.start += offset
          tag.end += offset

          const replacements = callback(tag, i)
          if (typeof replacements !== 'string') throw new Error('The callback of the replace method should return a string.')

          const before = _modified.substring(0, tag.start)
          const after = _modified.substring(tag.end)

          // Calculate new offset.
          offset += replacements.length - tag.contents.length

          // Apply replacement.
          _modified = `${before}${replacements}${after}`
        })

      return this
    },

    contents() {
      return _modified
    }
  }
}

module.exports = XmlCommentApi
