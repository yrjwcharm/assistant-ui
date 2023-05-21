/*
 * @Date: 2023-03-01 15:56:34
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-01 17:37:10
 * @FilePath: /assistant-mini/src/pages/member-buy/components/Banner.tsx
 * @Description: 临时活动页
 */

import React from "react";
import { View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { IUserComboListType } from "../type";
import "./index.less";

// const bannerImg =
//   "https://static.licaimofang.com/wp-content/uploads/2023/03/banner-activity.png";

// const default_url = "/pages/upgrade-activity/index";

interface IProps {
  data?: IUserComboListType;
}

export default function Banner(props: IProps) {
  const { data } = props;
  const url = data?.banner?.url;
  const handleClick = () => {
    if (url) {
      Taro.navigateTo({
        url: url,
      });
    }
  };

  if (!data?.banner?.img_url) return null;

  return (
    <View className="myBanner" onClick={handleClick}>
      <Image src={data?.banner?.img_url} className="img" mode="widthFix" />
    </View>
  );
}
