import React, { FC, useEffect } from "react";
import { View } from "@tarojs/components";

import "./index.less";
import { useStoreState } from "@/hooks";
import Taro, {
  getCurrentPages,
  useDidShow,
  useShareAppMessage
} from "@tarojs/taro";

import { defaultshareInfo } from "@/config/variables";
import { sendPoint } from "@/utils/sendPoint";
import CustomTabBar from "@/components/CustomTabBar";

import ActivityPk from "@/packageActivity/pages/activity-pk";
import HomeNavNav from "@/components/HomeNav";

let didShowDo: boolean = false;

const pageid: string = "PKhomepage";
let ts_in: number = 0;

const Activity: FC = () => {
  const {
    global: { userType }
  } = useStoreState();

  // const init = async () => {
  //   try {
  //     const res = await rightsList();
  //     setList(res || []);
  //   } catch (error) {}
  //   Taro.hideLoading();
  // };

  useDidShow(() => {
    didShowDo = true;
    // init();
    log();
  });

  const changeDidShowDo = () => {
    didShowDo = false;
  };

  useEffect(() => {
    if (!didShowDo) {
      // init();
      log();
    }
  }, [userType]);

  useEffect(() => {
    Taro.showLoading({
      title: "加载中..."
    });
  }, []);

  useShareAppMessage(_res => {
    return defaultshareInfo();
  });

  const log = () => {
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    if (current.route === "pages/activity/index") {
      ts_in = Date.now();
      sendPoint({
        pageid: pageid,
        ts: ts_in,
        event: "load"
      });
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <HomeNavNav nohead={true} title="基金理财助手" />
      <ActivityPk changeDidShowDo={changeDidShowDo} />
      <CustomTabBar path="pages/activity/index" />
    </View>
  );
};

export default Activity;
