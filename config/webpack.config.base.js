const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, '../view/index'),
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'], // 添加.tsx与.ts后缀解析
        alias: {
          "@": path.resolve(__dirname, 'view')
        }
      },
    
    module: {
        rules: [
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../public/index.html'),
            hash: true,
        }),
        new CleanWebpackPlugin(),
    ]
}
