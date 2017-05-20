require('babel-register')
const getConfig = require('hjs-webpack')
const toHtml = require('vdom-to-html')
const app = require('./src/views/app').default

module.exports = getConfig({
  in: 'src/main.js',
  out: 'public',
  clearBeforeBuild: true,
  performance: {
    hints: "error"
  },
  output: {
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  resolve: {
    alias: {
      'problems-arrays': './src/problems/arrays.js'
    }
  },
  html: function (context) {
    function render (state) {
      return context.defaultTemplate({html: toHtml(app(state))})
    }
    return {
      'about.html': render({url: '/about'}),
      'index.html': render({url: '/', problem: {tests: []}})
    }
  }
})
