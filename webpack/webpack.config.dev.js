const baseConfig = require('../webpack/webpack.config.base');
const { merge } = require('webpack-merge'); // 版本升级变成 {}
const webpack = require('webpack');
const path = require('path');
const localConfig = require('./localConfig');
const localCMD = process.env.DEV_LOCAL;
const localName = process.argv[4];
let proxy = {};
// console.log()
// 如果走本地任务
if (localCMD) {
    if (!localName) {
        throw new Error('本地调试模式：必须传对应的key(--h=wyf):详情见/webpack/localConfig.js')
    }
    const key = localName.split('=')[1]
    if (!localConfig[key]) {
        throw new Error('本地调试模式：必须传对应的key2:详情见/webpack/localConfig.js')
    }

    proxy = {
        'v2/oss_v1': {
            target: `${localConfig[key].host}:${localConfig[key].port}`,
            changeOrigin: true,
        },
        'v2/oss_v2': {
            target: `${localConfig[key].host}:${localConfig[key].port}`,
            changeOrigin: true,
        }
    }
}
console.log(proxy);
const config = merge(baseConfig, {
    mode: 'development',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DllReferencePlugin({
            manifest: require('../resource/vendor-manifest.json')
        }),
    ],
    devtool: '#eval',
    devServer: {
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
        proxy,
        watchOptions: {
            ignored: /node_modules/
        }
    }
})
// console.log(config,'merge----');
module.exports = config;
