动态依赖库，多线打包，css加后缀，项目架构
需要babel-plugin-import 
babel配置plugins [
["import", {
"libraryName": "anrd",
"libraryDirectory": "es",
"style": "css"
}]
]

整个项目目录结构 

剩余缓存没做.cache-loader
产生.cache-loader 使用 cache-loader 
// 文章https://www.cnblogs.com/zhonglinfeng666/p/13388809.html
 options: {cacheDirectory: path.resolve('.cache-loader')}


// 命令行配置
是Windows下使用set NODE_ENV=xx，Unix下应该为export NODE_ENV=xx  所以用cross-env
第二cross-env NODE_ENV=production ./node_modules/.bin/webpack --config ./webpack/webpack.config.prod.js

