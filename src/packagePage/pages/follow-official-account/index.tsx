/*
 * @Date: 2023-02-06 10:39:01
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-01 14:56:38
 * @FilePath: /assistant-ui/src/packagePage/pages/follow-official-account/index.tsx
 * @Description:
 */
import React, { FC, useEffect, useState } from "react";
import { View, Image, ScrollView } from "@tarojs/components";

import "./index.less";
import { AtIcon } from "taro-ui";
import Taro from "@tarojs/taro";
import { useStoreState } from "@/hooks";

enum IBackType {
  None = 0,
  BackBefore = 1,
  BackHome = 2,
}
const FollowOfficialAccount: FC = () => {
  const {
    global: { type },
  } = useStoreState();
  const [backType, setBackType] = useState<number>(0);

  useEffect(() => {
    const { back_type = 0 } = Taro.getCurrentInstance()?.router?.params ?? {};
    setBackType(~~back_type);
  }, []);

  return (
    <ScrollView scrollY className="follow-official-account">
      <View
        className="back-button"
        onClick={() => {
          if (backType === IBackType.None) {
            type == "springActivity"
              ? Taro.switchTab({
                  url: "/pages/buy-sell-signal/index",
                })
              : Taro.navigateBack({
                  delta: 2,
                });
          } else if (backType === IBackType.BackBefore) {
            Taro.navigateBack({
              delta: 1,
            });
          } else if (backType === IBackType.BackHome) {
            Taro.switchTab({
              url: "/pages/buy-sell-signal/index",
            });
          }
        }}
      >
        {(backType === IBackType.BackHome || backType === IBackType.None) && (
          <View>
            <AtIcon value="chevron-left" size="12" color="#0051CC" />
            点此开始使用买卖信号
          </View>
        )}
      </View>

      <View className="subtitle">还差一步即可获得每日买卖点提醒</View>
      <View className="title">长按识别关注基金理财工具公众号</View>
      <View className="qrcode-container">
        {/*换成包含特殊连接参数的公众号二维码*/}
        <Image
          src="https://static.licaimofang.com/wp-content/uploads/2023/03/lcgj_qrcode_for_mini.jpeg"
          style={{
            width: "364rpx",
            height: "364rpx",
          }}
          showMenuByLongpress
        />
      </View>
      <View className="explain-container">
        <View>
          <Image
            src={
              "https://static.licaimofang.com/wp-content/uploads/2023/03/daily_open_nav_3.png"
            }
            mode="widthFix"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default FollowOfficialAccount;
