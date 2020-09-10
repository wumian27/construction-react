const baseConfig = require('../webpack/webpack.config.base');
const { merge } = require('webpack-merge'); // 版本升级变成 {}
const webpack = require('webpack');
const path = require('path')

const config  = merge(baseConfig, {
    mode:'development',
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer:{
        port: 3000,
        open: true,
        // host: 'locahost',
        hot: true,
        historyApiFallback: true,
        overlay: true,
        compress: true,
        stats: {
            colors: true,
        },
        disableHostCheck: true,
        // webpack-dev-middleware options
        quiet: false,
        noInfo: true,
        lazy: false,
        watchOptions: {
            ignored: /node_modules/
        }
    }
})
// console.log(config,'merge----');
module.exports = config;
