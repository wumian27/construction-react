const baseConfig = require('../config/webpack.config.base');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { merge } = require('webpack-merge'); // 版本升级变成 {}
const config  = merge(baseConfig, {
    mode: 'production',
    plugins: [
        new BundleAnalyzerPlugin()
    ]
})

module.exports =  config
