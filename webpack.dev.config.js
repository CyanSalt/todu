const path = require('path')
const webpack = require('webpack')

module.exports = {
  target: 'electron',
  devtool: 'source-map',
  entry: {
    'main': path.resolve(__dirname, 'src/main.js')
  },
  output: {
    path: path.resolve(__dirname, 'src/build/'),
    filename: 'bundle.js',
    publicPath: '/src/'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV_PATH: JSON.stringify(path.resolve(__dirname, 'src/')),
    })
  ]
}
