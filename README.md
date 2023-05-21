##### 基金理财助手小程序源码
微信小程序搜索-基金理财助手


# yarn

$ yarn dev:weapp
$ yarn build:weapp

# npm script

$ npm run dev:weapp
$ npm run build:weapp

# 仅限全局安装

$ taro build --type weapp --watch
$ taro build --type weapp

# npx 用户也可以使用

$ npx taro build --type weapp --watch
$ npx taro build --type weapp

# watch 同时开启压缩

$ set NODE_ENV=production && taro build --type weapp --watch # Windows
$ NODE_ENV=production taro build --type weapp --watch # Mac

# 版本

node: v16.15.0
基础库: 2.24.4

** View 等标签 ts 类型报错：删除 node_modules -> @types -> hoist-non-react-statics 和 react-redux 文件夹 **
解决方案 安装" 目前已经处理了
resolutions": {
"@types/react": "17.0.2",
"@types/react-dom": "17.0.2"
}

# 提交

1. src -> config -> index.wxml: 更改 baseURL / h5BaseURL
2. !!!! 删除 dist 后执行 yarn build:weapp
