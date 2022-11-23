const fs = require('fs')
const path = require('path')

function HandleSourceMapPlugin () {
  this.processAfterEmit = function (compilation) {
    const chunks = compilation.chunks
    if (chunks.length) {
      const jsMapFiles = chunks.map(chunk => chunk.files.find(file => file.match(/(\.js.map)$/))).filter(file => file)
      jsMapFiles.forEach(fileName => {
        const directory = path.resolve(__dirname, '../dist/')
        fs.unlinkSync(directory + '/' + fileName)
      })
    }
    // eslint-disable-next-line no-console
    return Promise.all([]).then(() => console.log('------js map handled------'))
  }
}

HandleSourceMapPlugin.prototype.apply = function (compiler) {
  if (compiler.hooks) {
    compiler.hooks.afterEmit.tapPromise('HandleSourceMapPlugin', this.processAfterEmit.bind(this))
  }
}

module.exports = HandleSourceMapPlugin
