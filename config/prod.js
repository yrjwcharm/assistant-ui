/*
 * @Date: 2023-02-13 12:00:11
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-17 15:32:45
 * @FilePath: /assistant-ui/config/prod.js
 * @Description:
 */
module.exports = {
  env: {
    NODE_ENV: '"production"',
  },

  mini: {
    optimizeMainPackage: {
      enable: true,
    },
    plugins: ["taro-plugin-compiler-optimization"],
  },
};
