/*
 * @Date: 2023-01-09 11:50:26
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-23 16:04:36
 * @FilePath: /assistant-ui/src/pages/web-view/index.tsx
 * @Description:
 */
/* eslint-disable jsx-quotes */
import DefaultGraph from "@/components/DefaultGraph";
import { defaultshareInfo } from "@/config/variables";
import { useStoreState } from "@/hooks";
import { getLocalToken } from "@/utils/local";
import { WebView } from "@tarojs/components";
import Taro, { useRouter, useShareAppMessage } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { h5BaseURL } from "@/config";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { sendPoint } from "@/utils/sendPoint";

const MyWebView = () => {
  const {
    global: { userType, userInfo },
  } = useStoreState();

  const token = getLocalToken();
  const router = useRouter();
  const [url, setUrl] = useState("");
  Taro.setNavigationBarTitle({
    title: router.params.title || "定投计划详情",
  });

  useEffect(() => {
    Taro.showLoading({
      title: "加载中...",
    });
    const {
      invest_plan_id,
      fund_code,
      title = "",
    } = Taro.getCurrentInstance().router?.params ?? {};
    if (userType === "2") {
      if (invest_plan_id) {
        const uid = Taro.getStorageSync("uid");
        const token = Taro.getStorageSync("token");
        const channel = Taro.getStorageSync("channel");
        let url =
          h5BaseURL +
          `my-plan-detail?token=${token}&chn=${channel}&uid=${uid}&fund_code=${fund_code}&invest_plan_id=${invest_plan_id}`;
        setUrl(url);
      } else {
        setUrl(router.params?.url ?? "");
      }
    } else {
      if (~title.indexOf("服务协议")) {
        setUrl(router.params.url ?? "");
        return;
      }
      Taro.switchTab({
        url: "/pages/hold/index",
      });
    }
  }, []);
  // @ts-ignore
  useShareAppMessage(async (_res) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/hold/index" + path);
  });
  if (url) {
    return (
      <WebView
        onLoad={() => {
          Taro.hideLoading();
        }}
        onMessage={(e) => {
          const msgs = e.detail.data;
          msgs.forEach((m) => {
            if (m.type === "umeng")
              sendPoint({
                ...m.params,
                isFromH5: true,
              });
          });
        }}
        src={decodeURIComponent(url)}
      />
    );
  } else {
    return <DefaultGraph subtitle="页面地址错误" />;
  }
};

export default MyWebView;
