var path = require('path');
var webpack = require('webpack');

console.log(path.resolve(__dirname, '../../src'));

module.exports = {
  devtool: 'source-map',

  resolve: {
    alias: {
      'grax-react': path.resolve(__dirname, '../../dist/grax.min.js')
    }
  },

  entry: {
    index: ['./index']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'myapp',
    libraryTarget: 'umd',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, '../../src'),
        __dirname
      ]
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw'],
      include: __dirname
    }]
  }
};