const webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: {
    home: [
      'webpack-hot-middleware/client',
      './apps/home/client.js'
    ],
    backbone: [
      'webpack-hot-middleware/client',
      './apps/backbone/client.js'
    ],
    styled_components: [
      'webpack-hot-middleware/client',
      './apps/styled-components/client.js'
    ]
  },
  output: {
    filename: '[name].js',
    publicPath: '/static'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules'
    ]
  },
  node: {
    fs: 'empty'
  }
}
