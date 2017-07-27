<h1 align=center>XML Comment API</h1>

Parse XML comment that provide an API

## Installation

```shell
npm install xml-comment-api
```

## Usage

```js
const XmlCommentApi = require('xml-comment-api')

const input = `
  # Hello World
  <!-- salute(name:Rubens) --> <!-- /salute -->
`

XmlCommentApi(input).replace('salute', (tag) => `Hi ${tag.attributes.name}`)
// > # Hello World
//   <!-- salute(name:Rubens) -->Hi Rubens<!-- /salute -->

```

#### License

[MIT](LICENSE)
