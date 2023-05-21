/*
 * @Date: 2023-01-28 10:27:19
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-06 15:44:23
 * @FilePath: /assistant-ui/src/packageMenuActivity/pages/setmenu-activity/index.tsx
 * @Description:
 */
import React, { useEffect, useRef, useState } from "react";

import Taro, { useShareAppMessage } from "@tarojs/taro";
import { defaultshareInfo } from "@/config/variables";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { useStoreState } from "@/hooks";
import PageLayout from "@/components/PageLayout";
import { View, Image, ScrollView } from "@tarojs/components";
import BuyBtn from "./components/BuyBtn";
import { screenBottom } from "@/config/layoutSize";
import { callGetOneBuyActivityInfo } from "./services";
import { IOneBuydetail } from "./type";
import "./index.less";
import { sendPoint } from "@/utils/sendPoint";

const headImg =
  "https://static.licaimofang.com/wp-content/uploads/2023/02/header.png";
const content1Img =
  "https://static.licaimofang.com/wp-content/uploads/2023/02/content1.png";
const intro1Img =
  "https://static.licaimofang.com/wp-content/uploads/2023/02/intro-1.png";
const intro2Img =
  "https://static.licaimofang.com/wp-content/uploads/2023/03/intro-2.png";
const intro3Img =
  "https://static.licaimofang.com/wp-content/uploads/2023/03/intro-3.png";
const intro4Img =
  "https://static.licaimofang.com/wp-content/uploads/2023/02/intro-4.png";

function querySize(
  id: string,
  cb: Taro.NodesRef.BoundingClientRectCallback | undefined
) {
  Taro.createSelectorQuery().select(id).boundingClientRect(cb).exec();
}

definePageConfig({
  disableScroll: true,
});

interface IProps {}

export default function MemberBuyPay(props: IProps) {
  const {
    global: { userType },
  } = useStoreState();

  const [data, setData] = useState<IOneBuydetail>();
  const [showBottm, setBottom] = useState(false);
  const timer_durationRef = useRef(1000);

  useEffect(() => {
    callGetOneBuyActivityInfo().then((res: IOneBuydetail) => {
      Taro.setNavigationBarTitle({
        title: res.intro.page_title,
      });
      setData(res);
    });
  }, [userType]);

  useEffect(() => {
    sendPoint({
      pageid: "newusercomb",
      event: "load",
    });
  }, []);

  // @ts-ignore
  useShareAppMessage(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo(
      "packageMenuActivity/pages/setmenu-activity/index" + path
    );
  });
  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo(
      "packageMenuActivity/pages/setmenu-activity/index" + path
    );
  });

  useEffect(() => {
    userType !== "2"
      ? Taro.hideShareMenu()
      : Taro.showShareMenu({
          showShareItems: ["shareAppMessage", "shareTimeline"],
        });
  }, [userType]);

  // TODO：需要优化，检测底部按钮是否应该显示
  useEffect(() => {
    let timer: NodeJS.Timer;
    const queryBottom = () => {
      querySize("#buyBtn .paybtn", (rect) => {
        if (rect.top <= -rect.height) {
          setBottom(true);
          // 底部按钮显示时，200ms检查一次
          timer_durationRef.current = 200;
        } else {
          setBottom(false);
          // 底部按钮不显示时，1000ms检查一次
          timer_durationRef.current = 1000;
        }
        clearInterval(timer);
        timer = setInterval(queryBottom, timer_durationRef.current);
      });
    };
    timer = setInterval(queryBottom, timer_durationRef.current);

    return () => {
      clearInterval(timer);
    };
  });

  return (
    <PageLayout contentClass="pageContent">
      <ScrollView className="scrollWrap" scrollY scrollWithAnimation>
        <Image src={headImg} mode="widthFix" className="headImg" />
        <View className="buyContentWrap">
          <Image src={content1Img} mode="widthFix" className="contentImg" />
          <View className="buyBtnWrap" id="buyBtn">
            <BuyBtn data={data} isBottom={false} />
          </View>
        </View>
        <View
          className="introWrap"
          style={{ paddingBottom: screenBottom + 60 }}
        >
          <Image src={intro1Img} mode="widthFix" className="introImg" />
          <Image src={intro2Img} mode="widthFix" className="introImg" />
          <Image src={intro3Img} mode="widthFix" className="introImg" />
          <Image src={intro4Img} mode="widthFix" className="introImg" />
        </View>
        <View
          className="bottomBtnWrap"
          style={{ display: showBottm ? "block" : "none" }}
        >
          <BuyBtn data={data} isBottom={true} />
        </View>
      </ScrollView>
    </PageLayout>
  );
}
