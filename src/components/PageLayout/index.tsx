/*
 * @Date: 2023-01-30 15:10:52
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-17 16:11:52
 * @FilePath: /assistant-ui/src/components/PageLayout/index.tsx
 * @Description: 页面容器，用来处理自定义导航栏和tab的情况
 */
import { View } from "@tarojs/components";
import CustomTabBar from "@/components/CustomTabBar";
import HomeNavNav from "@/components/HomeNav";
import Taro from "@tarojs/taro";
import React from "react";
import { navbarHeight, tabbarHeight } from "@/config/layoutSize";
import "./index.less";

interface IProps extends React.PropsWithChildren {
  navConfig?: {
    show: boolean; // 是否显示 nav
    nohead: boolean;
    title: string; // 页面标题
  };
  tabConfig?: {
    show: boolean; // 是否显示 tab
    path: string; // 当前页面路由
  };
  contentClass?: string; // 内容的classname
  contentStyle?: object; // 内容的style
  isFull?: boolean; // 是否全屏
  params?: any;
  isBuy?: boolean;
}

export default function PageLayout(props: IProps) {
  const { navConfig, tabConfig, isFull = false, params, isBuy } = props;

  const info = Taro.getSystemInfoSync();
  const marginTop = navConfig?.show ? navbarHeight : 0;
  const marginBottom = tabConfig?.show
    ? tabbarHeight + (isBuy ? 95 : 0)
    : params?.withFound
    ? tabbarHeight
    : 0;

  const height = isFull
    ? `calc(${info.screenHeight}px - ${marginTop}px - ${marginBottom}px)`
    : "auto";

  return (
    <View className="layoutContainer">
      {navConfig?.show && (
        <View className="fixed_nav">
          <HomeNavNav nohead={navConfig.nohead} title={navConfig.title} />
        </View>
      )}
      <View
        className={`layoutContent ${props.contentClass}`}
        style={{
          marginTop: marginTop + "px",
          marginBottom: marginBottom + "px",
          height,
          ...props.contentStyle,
        }}
      >
        {props.children}
      </View>
      {tabConfig?.show && (
        <View className="fixed_tabbar">
          <CustomTabBar path={tabConfig.path} />
        </View>
      )}
    </View>
  );
}
