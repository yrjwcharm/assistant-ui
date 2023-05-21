/*
 * @Date: 2023-01-09 10:54:56
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-09 11:49:05
 * @FilePath: /assistant-ui/src/pages/family-finance-class/index.tsx
 * @Description:  
 */
import React from "react"
import Taro  from '@tarojs/taro'


//// 兼容老的家庭理财调整链接 2023-01-09 
export default function() {

  Taro.redirectTo({url:'/packageLession/pages/article/index'})
  return <></>
}