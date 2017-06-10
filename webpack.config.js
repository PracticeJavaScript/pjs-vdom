require('babel-core/register')
const path = require('path')
const getConfig = require('hjs-webpack')
const toHtml = require('vdom-to-html')
const app = require('./src/views/app').default
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

let config = getConfig({
  in: 'src/main.js',
  out: 'public',
  clearBeforeBuild: true,
  uglify: {
    compress: { warnings: false },
    output: { comments: false },
    sourceMap: false
  },
  devServer: {
    // port, // pulled from top level option "port"
    // hostname, // // pulled from top level option "hostname"
    historyApiFallback: true,
    hot: true,
    compress: true, // enable express compression to faster index reload (default: false)
    // The following options are for webpack-dev-middleware
    noInfo: true,
    quiet: false,
    lazy: false,
    // publicPath // pulled from top level option "output.publicPath"
  },
  performance: {
    hints: "error"
  },
  output: {
    path: path.resolve(__dirname, 'public/'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  html: function (context) {
    function render (state) {
      return context.defaultTemplate({
        html: toHtml(app(state)),
        charset: 'utf-8',
        title: 'Practice JavaScript with this fun game!',
        metaViewport: {
          userScalable: true
        },
        metaTags: {
          // viewport: 'width=device-width, initial-scale=1'
          'theme-color': '#FFC800',
          // <link rel="manifest" href="/manifest.json">
          // <link rel="icon" href="/launch-icon.svg">
          // OPEN GRAPH STUFF
          'og:title': 'Practice JavaScript!',
          'og:description': 'Practice JavaScript with this fun game!',
          'og:type': 'website',
          'og:image': 'https://practicejavascript.com/dist/img/social-banner.png',
          'og:url': 'https://practicejavascript.com',
          // TWITTER CARDS STUFF
          'twitter:card': 'summary',
          'twitter:site': '@jakob_anderson',
          'twitter:title': 'Practice JavaScript!',
          'twitter:description': 'Practice JavaScript with this fun game!',
          'twitter:image': 'https://practicejavascript.com/dist/img/social-banner.png',
          'twitter:image:alt': 'PracticeJavaScript Logo',
        }
      });
    }
    return {
      'index.html': render({url: '/', problem: {tests: []}})
    }
  }
})

config.plugins.push(
  new FaviconsWebpackPlugin('./src/img/pjs.png'),
  new SWPrecacheWebpackPlugin(
      {
        cacheId: 'practice-javascript',
        filename: 'sw.js',
        mergeStaticsConfig: true, // if you don't set this to true, you won't see any webpack-emitted assets in your serviceworker config
      }
    )
);

module.exports = config;
