/*
 * @Date: 2023-01-05 15:48:58
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-24 18:41:10
 * @FilePath: /assistant-ui/src/pages/member-buy/pay.tsx
 * @Description:
 */

import React, { useEffect } from "react";
import PayBase from "./base";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { defaultshareInfo } from "@/config/variables";
import { callInviteCard } from "@/pages/web-signal-details/services";

export default function MemberBuyPay() {
  // @ts-ignore
  useShareAppMessage(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/member-buy/index" + path);
  });
  const params = Taro.getCurrentInstance().router?.params;
  useDidShow(() => {
    Taro.eventCenter.trigger("page_show");
    Taro.eventCenter.trigger("member-buy_update");
  });
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "基金理财助手",
    }).then((r) => {});
  }, []);

  return <PayBase pageType="payback" params={params} />;
}
