
var webpack = require('webpack');

var webpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');

config.entry.index.unshift('webpack-dev-server/client?http://127.0.0.1:8080/', 'webpack/hot/dev-server');
config.plugins.push(new webpack.HotModuleReplacementPlugin());


var compiler = webpack(config);

var server = new webpackDevServer(compiler, {
    hot: true,
    stats: { 
        colors: true
    },
    compress: true,
    publicPath: '/static/'
});

server.listen(8080, '127.0.0.1', function() {
    console.log( 'start server' );
});


