const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  target: 'electron-renderer',
  devtool: 'source-map',
  stats: {
    modules: false,
  },
  node: {
    __dirname: false,
  },
  entry: {
    main: path.resolve(__dirname, 'src/main.js')
  },
  output: {
    path: path.resolve(__dirname, 'src/build/'),
    filename: 'bundle.js'
  },
  externals: {
    'original-fs': 'require("original-fs")',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.ProgressPlugin(),
  ],
}
