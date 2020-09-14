const path = require("path");
const chalk = require('chalk');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

let buildRunning = false;
let startTime = 0;

module.exports = {
    entry: path.resolve(__dirname, "../src/index"),
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, "../resource/view"),
    },
    resolve: {
        // 必须配置完整，否则 react-dom报错
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json"], // 添加.tsx与.ts后缀解析
        alias: {
            "@": path.resolve(__dirname, "view"),
        },
    },

    devtool: "#eval-source-map",

    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "cache-loader",
                        options: {
                            cacheDirectory: path.resolve('.cache-loader')
                        }
                    },
                    {
                        loader: "babel-loader?cacheDirectory=true",
                    }
                    ,]
            },
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                use: [
                    // 'cache-loader',
                    MiniCssExtractPlugin.loader,
                    // {
                    //     loader: 'style-loader'
                    // },
                    {
                        loader: "css-loader",
                        options: {
                            modules: false, // 启动css module
                        },
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ],
            },
            {
                test: /\.sass$/, // 处理sass文件
                use: [
                    {
                        loader: "cache-loader",
                        options: {
                            cacheDirectory: path.resolve('.cache-loader')
                        }
                    },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[hash:base64:6]",
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ],
            },
            {
                test: /\.less$/, // 处理less文件
                use: [
                    // {
                    //     // loader: "cache-loader",
                    //     // options: {
                    //     //     cacheDirectory: path.resolve('.cache-loader'),
                    //     //     readOnly: true,
                    //     // }
                    // },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                localIdentName: "[hash:base64:6]",
                            },
                        },
                    },
                    {
                        loader: "less-loader",
                    },
                    {
                        loader: 'postcss-loader'
                    }
                ],
            },

            {
                test: /\.woff|ttf|eot|svg|otf/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "fonts/[hash].[ext]",
                    },
                },
            },
            {
                test: /\.jpeg|png|gif|jpe$/, // 处理图片
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 100 * 2014,
                        name: "img/[name].[hash].[ext]",
                        publicPath: "./",
                    },
                },
            },
            // {
            //     test: /\.jpeg|png|gif|jpe$/, // 不能同时处理image  url-loader
            //     use: {
            //         loader: 'file-loader',
            //         options: {
            //             name: 'img/[name].[ext]'
            //         }
            //     }
            // },
        ],
    },
    // 优化
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    filename: '[name].bundle.js',
                    chunks: 'initial',
                    minChunks: 2,
                    priority: -10,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                },
                common: { // 抽离自己的公共模块
                    chunks: 'all',
                    name: 'common',
                    minSize: 0, // 只要大小超出设置的这个数值，就生成一个新包
                    minChunks: 2,
                    priority: 9
                }
            }
        },

        // minimizer: [new OptimizeCssAssetsPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "../src/index.html"),
            hash: true,
        }),

        // 定义全局变量
        new webpack.DefinePlugin({
            ...process.env.stringified,
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                DEV_LOCAL: process.env.DEV_LOCAL,
            }
        }),
        // 抽离 css
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
        }),
        // 压缩css
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                discardComents: {
                    removeAll: true,
                },
                autoprefixer: false,
                zindex: false,
            },
        }),

        // 缓存
        // new HardSourceWebpackPlugin(),

        // 忽略moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // new webpack.ProgressPlugin({
        //     handler: (percentage, msg) => {
        //         const stream = process.stderr;

        //         if (!buildRunning) {
        //             buildRunning = true;
        //             startTime = new Date();
        //         } else if (stream.isTTY && percentage < 0.71) {
        //             stream.cursorTo(0);
        //             stream.write(`${chalk.magenta(`${msg} ${Math.round(percentage * 100)}%`)}`);
        //             stream.clearLine(1);
        //         } else if (percentage === 1) {
        //             const now = new Date();
        //             const buildTime = `${(now - startTime) / 1000}s`;
        //             console.log(chalk.green(`\nwebpack: bundle build completed in ${buildTime}.`));

        //             buildRunning = false;
        //         }
        //     },
        // }),
    ],

    // 只是表面错误，看有没有其他的
    performance:{
        // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
        hints: 'warning',
        // / 开发环境设置较大防止警告
        // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
        maxEntrypointSize: 5000000,
        maxAssetSize: 3000000,
    }
};
