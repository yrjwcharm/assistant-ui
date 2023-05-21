/*
 * @Date: 2022/11/15 17:26
 * @Author: yanruifeng
 * @Description:添加webpack相关配置-显示打包进度 打包体积优化，压缩打包体积 分离chunk
 */

const path = require("path");
import { resolve } from "path";
const config = {
  projectName: "assistant-ui",
  date: "2022-6-1",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: [],
  copy: {
    patterns: [],
    options: {},
  },
  framework: "react",
  compiler: {
    type: "webpack5",
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
    hints: false,
  },
  cache: {
    enable: true, //开启持久化缓存
  },
  defineConstants: {
    API_ENV: `"${process.env.NODE_ENV}"`,
  },
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true, //解决miniCssExtractPlugin插件css排序问题
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  alias: {
    "@": resolve(__dirname, "..", "src/"),
    "@actions": path.resolve(__dirname, "..", "src/actions"),
    "@assets": path.resolve(__dirname, "..", "src/assets"),
    "@components": path.resolve(__dirname, "..", "src/components"),
    "@constants": path.resolve(__dirname, "..", "src/constants"),
    "@reducers": path.resolve(__dirname, "..", "src/reducers"),
    "@styles": path.resolve(__dirname, "..", "src/styles"),
    "@utils": path.resolve(__dirname, "..", "src/utils"),
    "@config": path.resolve(__dirname, "..", "src/config"),
    "@services": path.resolve(__dirname, "..", "src/services"),
    "@views": path.resolve(__dirname, "..", "src/views"),
    "@store": path.resolve(__dirname, "..", "src/store"),
  },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
