const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        vendor: ['react','react-dom','react-router']
    },
    output:{
        path: path.resolve('./resource'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    mode: 'production',
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve('./resource','[name]-manifest.json'),
            name: '[name]_library'
        })
    ]
}
