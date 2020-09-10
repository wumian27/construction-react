module.exports = {
    "presets": [
        "@babel/preset-react",
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": [
                        "last 5 versions",
                        "ie >= 9"
                    ]
                }
            }
        ],
        '@babel/preset-typescript'  // 配置支持typescript 跟@babel/preset-typescript
    ],
    plugins: [
        [
            "import",
            {
                "libraryName": "antd",
                "librayDirectory": "es",
                "style": "css"
            }
        ], 
    ]
}
