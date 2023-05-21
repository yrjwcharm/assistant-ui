/*
 * @Date: 2023-01-30 14:41:04
 * @LastEditors: yanruifeng yanruifeng@licaimofang.com
 * @LastEditTime: 2023-02-03 13:42:59
 * @FilePath: /assistant-ui/src/pages/member-buy/components/Header.tsx
 * @Description: 我的页面-顶部用户信息组件
 */

import { useStoreState } from "@/hooks";
import React from "react";
import { View, Text, Image } from "@tarojs/components";
import { Divider } from "@taroify/core";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import { IUserComboListType } from "../type";
import "./index.less";

interface IProps {
  data?: IUserComboListType;
}

function Header(props: IProps) {
  const {
    global: { userType },
  } = useStoreState();
  const { data } = props;
  const [renderPhoneAuthButton] = usePhoneAuthorization();

  const userHead =
    data?.headimgurl ??
    "https://static.licaimofang.com/wp-content/uploads/2022/06/assistant-defaultMiniHeadImg.png";
  const userName = data?.nickname ?? "";
  const asserts = [
    {
      name: "已解锁基金(支)",
      value: data?.can_read_num ?? 0,
    },
    {
      name: "还可解锁基金(支)",
      value: data?.can_lock_num ?? 0,
    },
  ];
  return (
    <View
      className="user-headerWrap"
      style={{
        background: `url(${
          data?.vip_level == 0
            ? "https://static.licaimofang.com/wp-content/uploads/2023/03/index_normal_1.png"
            : data?.vip_level == 1
            ? "https://static.licaimofang.com/wp-content/uploads/2023/03/index_vip_1.png"
            : data?.vip_level == 10
            ? "https://static.licaimofang.com/wp-content/uploads/2023/03/index_svip_1.png"
            : ""
        }) no-repeat`,
        backgroundSize: "contain",
      }}
    >
      <Image
        src={
          data?.vip_level == 0
            ? require("@/assets/images/member-buy/ordinary.png")
            : data?.vip_level == 1
            ? require("@/assets/images/member-buy/low_member.png")
            : data?.vip_level == 10
            ? require("@/assets/images/member-buy/high_member.png")
            : null
        }
        className="level"
      />
      <View className="headWrap authWrap">
        {userType != "2" ? renderPhoneAuthButton() : null}
        <View className="flexCenterWrap">
          <Image className="headimg" src={userHead} />
          <View className="level_wrap">
            <Text
              className="username"
              style={{
                color:
                  data?.vip_level == 0
                    ? "#121d3a"
                    : data?.vip_level == 1
                    ? "#725232"
                    : data?.vip_level == 10
                    ? "#FFEBCD"
                    : "transparent",
              }}
            >
              {userName}
            </Text>
            <Text
              className="expire"
              style={{
                color:
                  data?.vip_level == 0
                    ? "#545968"
                    : data?.vip_level == 1
                    ? "rgba(114,82,50,0.7)"
                    : data?.vip_level == 10
                    ? "rgba(255,235,205,0.698)"
                    : "transparent",
              }}
            >
              {data?.vip_expire}
            </Text>
          </View>
        </View>
      </View>

      <Divider />

      <View className="assetWrap">
        {asserts.map((item) => (
          <View className="assetItem">
            <Text
              className="value"
              style={{
                color:
                  data?.vip_level == 0
                    ? "#121d3a"
                    : data?.vip_level == 1
                    ? "#725232"
                    : data?.vip_level == 10
                    ? "#FFEBCD"
                    : "transparent",
              }}
            >
              {item.value}
            </Text>
            <Text
              className="name"
              style={{
                color:
                  data?.vip_level == 0
                    ? "#545968"
                    : data?.vip_level == 1
                    ? "rgba(114,82,50,0.7)"
                    : data?.vip_level == 10
                    ? "rgba(255,235,205,0.698)"
                    : "transparent",
              }}
            >
              {item.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default Header;
