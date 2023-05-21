/*
 * @Date: 2023-01-28 10:27:19
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-02 15:13:49
 * @FilePath: /assistant-ui/src/pages/upgrade-activity/index.tsx
 * @Description:
 */
/*
 * @Date: 2023-01-05 15:48:58
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-05 17:28:59
 * @FilePath: /assistant-ui/src/pages/member-buy/index.tsx
 * @Description:
 */

import React, { useEffect, useRef, useState } from "react";

import Taro, { useShareAppMessage } from "@tarojs/taro";
import { defaultshareInfo } from "@/config/variables";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { useStoreState } from "@/hooks";
import PageLayout from "@/components/PageLayout";
import { View, Image, ScrollView } from "@tarojs/components";
import { screenBottom } from "@/config/layoutSize";
import "./index.less";
import { sendPoint } from "@/utils/sendPoint";

const btnTopImg =
  "https://static.licaimofang.com/wp-content/uploads/2023/03/btn_top.png";
const btnBottomImg =
  "https://static.licaimofang.com/wp-content/uploads/2023/03/btn_bottom.png";
const intro1Img =
  "https://static.licaimofang.com/wp-content/uploads/2023/03/ac_1.png";
const intro2Img =
  "https://static.licaimofang.com/wp-content/uploads/2023/03/ac_2.png";
const intro3Img =
  "https://static.licaimofang.com/wp-content/uploads/2023/03/ac_3.png";

function querySize(
  id: string,
  cb: Taro.NodesRef.BoundingClientRectCallback | undefined
) {
  Taro.createSelectorQuery().select(id).boundingClientRect(cb).exec();
}

console.log("screenBottom:", screenBottom);
interface IProps {}

// definePageConfig({
//   disableScroll: true,
// });

export default function MemberBuyPay(props: IProps) {
  const {
    global: { userType },
  } = useStoreState();

  const [showBottm, setBottom] = useState(false);
  const timer_durationRef = useRef(1000);

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "基金理财助手",
    });
  }, []);

  // @ts-ignore
  useShareAppMessage(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("pages/upgrade-activity/index" + path);
  });
  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("pages/upgrade-activity/index" + path);
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
      querySize("#btnWrap", (rect) => {
        console.log("btn:", rect);
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

  const handleToPay = () => {
    Taro.switchTab({
      url: "/pages/member-buy/index",
    });
  };

  return (
    <PageLayout
      contentClass="upgrade-activity"
      contentStyle={{ paddingBottom: screenBottom }}
    >
      <ScrollView className="scrollWrap" scrollY scrollWithAnimation>
        <View className="headerWrap">
          <Image src={intro1Img} mode="widthFix" className="introImg" />
          <View className="btnWrap animator" id="btnWrap" onClick={handleToPay}>
            <Image src={btnTopImg} className="img" mode="aspectFill" />
          </View>
        </View>
        <Image
          src={intro2Img}
          mode="widthFix"
          className="introImg"
          showMenuByLongpress={true}
        />
        <Image src={intro3Img} mode="widthFix" className="introImg" />

        <View
          className="bottomBtnWrap"
          style={{
            display: showBottm ? "flex" : "none",
            paddingBottom: screenBottom,
          }}
        >
          <View className="btnWrap animator" onClick={handleToPay}>
            <Image src={btnBottomImg} className="img" mode="aspectFill" />
          </View>
        </View>
      </ScrollView>
    </PageLayout>
  );
}
