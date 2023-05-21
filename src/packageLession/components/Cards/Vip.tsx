/*
 * @Date: 2023-01-09 16:56:05
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-09 18:42:07
 * @FilePath: /assistant-ui/src/packageLession/components/Cards/Vip.tsx
 * @Description:
 */

import React from "react";
import { View, Text } from "@tarojs/components";
import { INo_member_info, IMedio } from "../../types/index";
import "./Vip.less";

interface IProps extends INo_member_info, IMedio {
  title: string;
  isTry: boolean;
  tryUpLevel: (arg0: any) => void;
}

export default function Vip(props: IProps) {
  const { no_member_info, isTry, tryUpLevel } = props;

  if (!isTry) return null;

  return (
    <View className="vipCard">
      <View className="titleWrap">
        <Text className="title">{no_member_info.introduce_title}</Text>
        {(no_member_info.introduce_content || []).map((line) => (
          <Text key={line} className="desc">
            {line}
          </Text>
        ))}
      </View>
      <View>
        <View className="upBtn" onClick={tryUpLevel}>
          <View className="tipWrap">
            <Text className="tip">
              {no_member_info.introduce_button_keyword}
            </Text>
          </View>
          <Text className="upBtn_text">
            {no_member_info.introduce_button_title}
          </Text>
        </View>
      </View>
    </View>
  );
}
