/*
 * @Date: 2023-02-03 12:25:40
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-03 14:36:45
 * @FilePath: /assistant-ui/babel.config.js
 * @Description:
 */
// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      "taro",
      {
        framework: "react",
        ts: true,
      },
    ],
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "taro-hooks",
        camel2DashComponentName: false,
      },
      "taro-hooks",
    ],
    [
      "import",
      {
        libraryName: "@taroify/core",
        libraryDirectory: "",
        style: true,
      },
      "@taroify/core",
    ],
    [
      "import",
      {
        libraryName: "@taroify/icons",
        libraryDirectory: "",
        camel2DashComponentName: false,
        style: () => "@taroify/icons/style",
      },
      "@taroify/icons",
    ],
    [
      "import",
      {
        libraryName: "taro-ui",
        customName: (name) => {
          return `taro-ui/lib/components/${name.substr(3)}`;
        },
        style: () => false,
      },
      "taro-ui",
    ],
  ],
};
