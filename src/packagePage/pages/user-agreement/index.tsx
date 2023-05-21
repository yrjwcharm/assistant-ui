/* eslint-disable jsx-quotes */
import { defaultshareInfo } from "@/config/variables";
import { WebView } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import React, { useEffect } from "react";

const UserAgreement = () => {
  useEffect(() => {
    Taro.showLoading({
      title: "加载中...",
    });
  }, []);

  useShareAppMessage((res) => {
    return defaultshareInfo();
  });

  return (
    <WebView
      onLoad={() => {
        Taro.hideLoading();
      }}
      src="https://market-saas.licaimofang.com/saash5/user-agreement"
    />
  );
};

export default UserAgreement;
