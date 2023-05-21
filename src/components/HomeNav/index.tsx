/*
 * @Date: 2023-01-03 11:15:16
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-16 17:38:57
 * @FilePath: /assistant-ui/src/components/HomeNav/index.tsx
 * @Description: 自定义导航栏
 */
/* eslint-disable jsx-quotes */
import { useStoreState } from "@/hooks";
import { View, Image, Text } from "@tarojs/components";
import React, { FC, useEffect } from "react";
import { screenTop, navbarInnerHeight } from "@/config/layoutSize";
import "./index.less";

interface NavProps {
  title?: string;
  nohead?: boolean;
}

const HomeNavNav: FC<NavProps> = ({ title = "", nohead = false }) => {
  const {
    global: { userType, userInfo },
  } = useStoreState();

  useEffect(() => {}, []);

  return (
    <View
      style={{
        paddingTop: screenTop,
      }}
      className="home-nav"
    >
      <View className="home-nav-content" style={{ height: navbarInnerHeight }}>
        <View className="left">
          {userType !== "0" && !nohead ? (
            <Image src={userInfo.headimgurl} />
          ) : null}
        </View>
        <Text className="center">{title}</Text>
        <View className="right" />
      </View>
    </View>
  );
};

export default HomeNavNav;
