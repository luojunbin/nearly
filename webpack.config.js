var path = require('path')
var webpack = require('webpack')

var reactExternal = {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react'
}

var config = {

    externals: {
        'react': reactExternal
    },

    entry: [
        './src/index'
    ],

    output: {
        library: 'Nearly',
        libraryTarget: 'umd',
        path: path.join(__dirname, 'dist'),
        filename: 'nearly.js'
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin()
    ],

    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            exclude: /node_modules/,
            include: path.join(__dirname, 'src')
        }]
    }
}

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            }
        })
    );
    config.output.filename = 'nearly.min.js';
}

module.exports = config;