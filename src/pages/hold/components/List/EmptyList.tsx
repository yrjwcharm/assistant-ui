/*
 * @Date: 2023-02-07 15:57:59
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-15 16:17:46
 * @FilePath: /assistant-ui/src/pages/hold/components/List/EmptyList.tsx
 * @Description:
 */

import {View, Text} from "@tarojs/components";
import React from "react";
import DefaultGraph from "@/components/DefaultGraph";
import "../../index.less";
import Button from "@/components/Button";

interface IProps {
  onAdd: () => void;
  type: number;
}
export default function EmptyList(props: IProps) {
  // @ts-ignore
  return (
    <View className="no-data" style={{ marginTop: "0" }}>
      <DefaultGraph title="暂无数据" />
      <View className="import-btn">
        <View
          style={{
            width: "400rpx",
            position: "relative",
          }}
        >
          <Button onClick={props.onAdd}>
            导入{props.type === 0 ? "持有" : "关注"}基金
          </Button>
        </View>
        <Text>已支持 蚂蚁财富/天天基金平台的导入</Text>
      </View>
    </View>
  );
}
