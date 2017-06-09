require('babel-core/register')
const getConfig = require('hjs-webpack')
const toHtml = require('vdom-to-html')
const app = require('./src/views/app').default
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
// const UglifyEsPlugin = require('uglify-es-webpack-plugin');

let config = getConfig({
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

// if (process.env.NODE_ENV === 'production') {
//   module.exports.devtool = 'source-map';
//   module.exports.plugins = (module.exports.plugins || []).concat([
//     new UglifyEsPlugin()
//   ]);
// }
console.log('config:', config);

// config.plugins = (module.exports.plugins || []).concat([
//   // new FaviconsWebpackPlugin('./src/img/monitor.svg')
// ]);

module.exports = config;
