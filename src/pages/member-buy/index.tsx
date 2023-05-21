/*
 * @Date: 2023-01-28 10:27:19
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-27 10:57:25
 * @FilePath: /assistant-ui/src/pages/member-buy/index.tsx
 * @Description:
 */
import React, { useEffect } from "react";
import PayBase from "./base";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { defaultshareInfo } from "@/config/variables";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { useStoreState } from "@/hooks";
export default function MemberBuyPay() {
  const {
    global: { userType },
  } = useStoreState();

  // @ts-ignore
  useShareAppMessage(async (_res) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/member-buy/index" + path);
  });
  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/member-buy/index" + path);
  });
  useEffect(() => {
    userType !== "2"
      ? Taro.hideShareMenu()
      : Taro.showShareMenu({
          showShareItems: ["shareAppMessage", "shareTimeline"],
        });
  }, [userType]);
  useDidShow(() => {
    Taro.eventCenter.trigger("page_show");
    Taro.eventCenter.trigger("member-buy_update");
  });

  return <PayBase />;
}
