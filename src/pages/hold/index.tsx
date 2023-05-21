/*
 * @Date: 2023-02-07 15:10:40
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-03 16:30:58
 * @FilePath: /assistant-ui/src/pages/hold/index.tsx
 * @Description:
 */
import React, { FC, useEffect } from "react";

import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";

import ReminderCenter from "./components/ReminderCenter";
import Banner from "./components/Banner";

import { useStoreState } from "@/hooks";

import { defaultshareInfo } from "@/config/variables";
import { sendPoint } from "@/utils/sendPoint";
import { callInviteCard } from "@/pages/web-signal-details/services";
import PageLayout from "@/components/PageLayout";
import List from "./components/List";
import InvitGuide from "./components/InvitGuide";
const Hold: FC = () => {
  const {
    global: { userInfo, userType },
  } = useStoreState();

  useEffect(() => {
    // @ts-ignore
    const { is_pop_out } = userInfo;
    if (is_pop_out) {
      sendPoint({
        pageid: "Surprisewelfare",
        ts: Date.now(),
        event: "load",
      });
    }
  }, [userInfo]);

  useDidShow(() => {
    Taro.eventCenter.trigger("HoldPageShow");
  });
  useEffect(() => {
    sendPoint({
      pageid: "holdattention",
      event: "load",
      ts: Date.now(),
    });
  }, []);

  // @ts-ignore
  useShareAppMessage(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/hold/index" + path);
  });

  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/hold/index" + path);
  });

  return (
    <PageLayout
      navConfig={{ show: true, nohead: true, title: "基金理财助手" }}
      tabConfig={{ show: true, path: "pages/hold/index" }}
      isFull={userType === "2"}
      contentClass="holdPageContent"
    >
      <InvitGuide />
      <ReminderCenter />
      <Banner />
      <List />
    </PageLayout>
  );
};

export default Hold;
