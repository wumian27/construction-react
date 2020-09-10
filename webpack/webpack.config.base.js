const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const loader = require("sass-loader");
const webpack = require("webpack");

module.exports = {
    entry: path.resolve(__dirname, "../src/view/index"),
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
                use: {
                    loader: "babel-loader?cacheDirectory=true",
                },
            },
            {
                test: /\.css$/,
                // exclude: /node_modules/,
                use: [
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
        // 压缩css
        minimizer: [new OptimizeCssAssetsPlugin()],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "../src/view/index.html"),
            hash: true,
        }),
        new webpack.DllReferencePlugin({
            manifest: require('../resource/vendor-manifest.json')
        }),
        // 抽离 css
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
        }),
    ],
};
