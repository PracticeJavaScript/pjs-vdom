require('babel-core/register')
const path = require('path')
const getConfig = require('hjs-webpack')
const toHtml = require('vdom-to-html')
const app = require('./src/views/app').default
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const PwaManifestWebpackPlugin = require('pwa-manifest-webpack-plugin');

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
        // metaViewport: {
        //   userScalable: true
        // },
        head: `
          <link rel="manifest" href="/manifest.json">
          <link rel="icon" href="/icons/favicon.ico">
        `,
        metaTags: {
          // viewport: 'width=device-width, initial-scale=1'
          'theme-color': '#FFC800',
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
      'index.html': render({url: '/', problem: {tests: []}}),
      'manifest.json': `{
        "name": "Practice-JavaScript",
        "short_name": "PracticeJS",
        "description": "Practice JavaScript with this fun game!",
        "dir": "auto",
        "lang": "en-US",
        "display": "standalone",
        "orientation": "any",
        "start_url": "/index.html",
        "background_color": "#FFC800",
        "theme_color": "#FFC800",
        "display": "minimal-ui",
        "icons": [
          {
            "src": "/icons/android-chrome-36x36.png",
            "sizes": "36x36",
            "type": "image/png"
          },
          {
            "src": "/icons/android-chrome-48x48.png",
            "sizes": "48x48",
            "type": "image/png"
          },
          {
            "src": "/icons/android-chrome-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
          },
          {
            "src": "/icons/android-chrome-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "/icons/android-chrome-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "/icons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/icons/android-chrome-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "/icons/android-chrome-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "/icons/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }`
    }
  }
})

config.plugins.push(
  new FaviconsWebpackPlugin({
    title: 'Practice-JavaScript',
    description: 'Practice JavaScript with this fun app',
    logo: './src/img/pjs3.png',
    prefix: 'icons/',
    // start_url: '/index.html?utm_source=homescreen',
    background: '#FFC800',
    theme_color: '#FFC800',
    display: 'minimal-ui',
    inject: false,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      coast: false,
      favicons: true,
      firefox: true,
      opengraph: true,
      twitter: false,
      yandex: false,
      windows: false
    }
  }),
  new SWPrecacheWebpackPlugin(
      {
        cacheId: 'practice-javascript',
        filename: 'sw.js',
        mergeStaticsConfig: true, // if you don't set this to true, you won't see any webpack-emitted assets in your serviceworker config
        staticFileGlobsIgnorePatterns: [/icons*\/*/]
      }
    )
);

module.exports = config;
