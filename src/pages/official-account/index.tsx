/*
 * @Date: 2023-03-06 14:11:39
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-06 16:48:13
 * @FilePath: /assistant-ui/src/pages/official-account/index.tsx
 * @Description:
 */
import React, { FC } from "react";
import { View, Image, Text } from "@tarojs/components";

import "./index.less";
import { AtDivider } from "taro-ui";
import Taro from "@tarojs/taro";
import back from "@/assets/images/back.png";
const OfficialAccount: FC = () => {
  return (
    <View className="official_account_box">
      <View className="focus_official">
        <Text className="title">每日获取买卖信号消息推送</Text>
        <Text className="sub_title">长按识别关注基金理财工具公众号</Text>
        <Image
          src="https://static.licaimofang.com/wp-content/uploads/2023/03/lcgj_qrcode_for_mini.jpeg"
          showMenuByLongpress={true}
          className="official_img"
        />
        <AtDivider lineColor="#E9EAEF" />
        <Image
          mode="widthFix"
          className="remind"
          src="https://static.licaimofang.com/wp-content/uploads/2023/03/daily_open_nav_3.png"
        />
        <View
          className="back_wrap"
          onClick={() => {
            Taro.navigateBack({
              delta: 1,
            });
          }}
        >
          <Image src={back} className="back" />
          <Text className="back_text">返回买卖信号基金详情页</Text>
        </View>
      </View>
    </View>
  );
};

export default OfficialAccount;
