const baseConfig = require('../config/webpack.config.base');
const { merge } = require('webpack-merge'); // 版本升级变成 {}
const config  = merge(baseConfig, {
    mode: 'production'
})

module.exports =  config
