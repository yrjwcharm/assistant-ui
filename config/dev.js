/*
 * @Date: 2023-02-06 10:35:59
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-17 16:16:59
 * @FilePath: /assistant-ui/config/dev.js
 * @Description:
 */
module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  cache: {
    enable: true,
    type: "filesystem",
    maxAge: 5184000000,
  },
  compiler: {
    type: "webpack5",
    prebundle: {
      enable: false, // 开发环境使用webpack的filestytem cache 不需要prebundle
    },
  },
  jsMinimizer: "esbuild",
  terser: {
    enable: false,
  },
  esbuild: { minify: { enable: false } },
  mini: {
    hot: true,
    // //压缩配置
    webpackChain(chain, webpack) {
      chain
        .plugin("analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin, []);
    },
  },
  h5: {},
};
