/*
 * @Date: 2023-02-07 11:19:41
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-08 17:19:50
 * @FilePath: /assistant-ui/src/pages/optional/index.tsx
 * @Description:
 */
import React from "react";
import Taro from "@tarojs/taro";

//// 兼容老的关注页 2023-02-08
export default function () {
  Taro.redirectTo({ url: "/pages/hold/index" });
  return <></>;
}
