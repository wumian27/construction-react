const baseConfig = require('../webpack/webpack.config.base');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//  plugins 构建进度
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// 输出打包文件的大小
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// 压缩js
const TerserPlugin =  require('terser-webpack-plugin');
// 将代码合并起来
const { merge } = require('webpack-merge'); // 版本升级变成 {}
const config  = merge(baseConfig, {
    mode: 'production',
    optimization: {
        minimizer:[new TerserPlugin(
            {
                cache: true,
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: true, // 删除所有的 `console` 语句
                    },
                },
            }
        )]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            // analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 7778,
            reportFilename: path.resolve(__dirname,'../resource/analyze/report.html'),
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: true,
            statsFilename: path.resolve(__dirname, '../resource/analyze/stats.json'),
            statsOptions: null,
            logLevel: 'info',
            analyzerMode: 'static',
        }),
        // 删除空的dist，再写入
        new CleanWebpackPlugin(),
        new ProgressBarPlugin(),
    ]
})

module.exports =  config
