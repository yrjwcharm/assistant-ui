/*
 * @Date: 2023-02-14 11:27:19
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-14 11:44:33
 * @FilePath: /assistant-ui/src/components/Tab/index.tsx
 * @Description:
 */

import { View, Text } from "@tarojs/components";
import React from "react";
import "./index.less";

interface IProps {
  titles: string[];
  value: number;
  onChange: (index: number, title: string) => void;
}

export default function Tab(props: IProps) {
  const { titles, onChange, value } = props;

  return (
    <View className="tab">
      {(titles || []).map((title, i) => (
        <View
          className={`tabitem ${value == i ? "selected" : ""}`}
          onClick={() => onChange(i, title)}
        >
          <Text className="title">{title}</Text>
          <View className="line" />
        </View>
      ))}
    </View>
  );
}
