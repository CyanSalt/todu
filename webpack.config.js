const path = require('path')
const webpack = require('webpack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  target: 'electron-renderer',
  devtool: 'source-map',
  stats: {
    modules: false,
    entrypoints: false,
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
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          MiniCSSExtractPlugin.loader,
          'css-loader',
        ]
      }
    ]
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'bundle.css',
    }),
    new webpack.ProgressPlugin(),
    new VueLoaderPlugin(),
  ],
}
