module.exports = {
    presets: [
        [
            '@babel/env',
        {
            useBuiltIns: 'usage',
            corejs: 3,
        }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'  // 配置支持typescript 跟@babel/preset-typescript
    ]
}
