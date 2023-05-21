/*
 * @Date: 2023/3/13 10:56
 * @Author: yanruifeng
 * @Description:
 */

import { Image, Input, Text, View } from "@tarojs/components";
import { sendPoint } from "@/utils/sendPoint";
import { Swiper } from "@taroify/core";
import { toSignalDetails } from "@/pages/reminder-list/toSignalDetails";
import React from "react";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import { useStoreState } from "@/hooks";
import { TIntro, TSwiperItem } from "@/pages/buy-sell-signal/type";
const HeaderComponent = ({
  isExpand,
  intro,
  swiperList,
  headerSearchClick,
  expandClick,
}: {
  isExpand: boolean;
  swiperList: TSwiperItem[];
  headerSearchClick: () => void;
  intro: TIntro;
  expandClick: () => void;
}) => {
  const [renderPhoneAuthButton] = usePhoneAuthorization();
  const {
    global: { userType },
  } = useStoreState();
  return (
    <View
      className="header"
      style={{
        background: `url(${
          isExpand
            ? "https://static.licaimofang.com/wp-content/uploads/2023/02/buy_sell_signal.png"
            : "https://static.licaimofang.com/wp-content/uploads/2023/02/big_buy_sell_signal.png"
        })`,
        backgroundSize: "contain",
        position: "relative",
        backgroundRepeat: "repeat-x",
        height: isExpand ? "278PX" : "529PX",
      }}
    >
      {userType !== "2" ? renderPhoneAuthButton() : null}
      <View className="header_search" onClick={headerSearchClick}>
        <Image
          src={require("@assets/images/search.png")}
          className="search_icon"
        />
        <Input
          className="input"
          disabled={true}
          placeholder="搜基金名称/代码，看看买卖信号能提升多少收益"
          placeholderClass="placeholderClass"
        />
        {userType !== "2" ? renderPhoneAuthButton() : null}
      </View>
      <View className="header_info">
        <Text className="title">{intro.top}</Text>
        <View className="top_tips">
          <Image
            className="tips_icon"
            src={require("@/assets/images/buy-sell-signal/tips.png")}
          />
          <Text className="tips">{intro.title?.[0] ?? ""}</Text>
        </View>
        <View className="middle_tips">
          <Image
            className="tips_icon"
            src={require("@/assets/images/buy-sell-signal/tips.png")}
          />
          <Text className="tips">{intro.title?.[1] ?? ""}</Text>
        </View>
        <View className="bottom_tips">
          <Image
            className="tips_icon"
            src={require("@/assets/images/buy-sell-signal/tips.png")}
          />
          <Text className="tips">{intro.title?.[2] ?? ""}</Text>
        </View>
      </View>
      {!isExpand && (
        <View className="buy_sell_remark">
          <Image className="img" src={intro.more_img} />
        </View>
      )}
      <View className="header_isExpand" onClick={expandClick}>
        <Text className="isExpandTips">
          {isExpand ? "展开信号介绍" : "收起信号介绍"}
        </Text>
        <Image
          className="isExpand_icon"
          src={
            isExpand
              ? require("@/assets/images/buy-sell-signal/isExpand_icon.png")
              : require("@/assets/images/buy-sell-signal/up.png")
          }
        />
      </View>
      {swiperList?.length > 0 && (
        <View className="header_carousel">
          <View className="content_wrap">
            <Image className="icon" src={intro.scroll_icon} />
            <View className="separator" />
            <Swiper
              touchable={false}
              loop={true}
              height={32}
              className="swiper"
              autoplay={3000}
              direction="vertical"
            >
              {swiperList?.map((item) => {
                return (
                  <Swiper.Item
                    onTouchMove={(e) => {
                      return e.preventDefault();
                    }}
                    className="swiper_item"
                    onClick={() => {
                      sendPoint({
                        pageid: "signallist",
                        ts: Date.now(),
                        // ts: ts_in_app,
                        event: "click3",
                      });
                      toSignalDetails(item.fund_code);
                    }}
                  >
                    <View className="right_content">
                      <Text>用户{item.mobile}解锁</Text>
                      <Text className="fund_name">{item.fund_name}</Text>
                      买卖信号，
                      <Text className="profit">超额收益{item.ret}</Text>
                    </View>
                  </Swiper.Item>
                );
              })}
            </Swiper>
          </View>
        </View>
      )}
    </View>
  );
};
export default HeaderComponent;
