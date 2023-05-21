/*
 * @Date: 2023-02-28 16:26:14
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-28 16:48:15
 * @FilePath: /assistant-ui/src/pages/member-buy/components/InviteCom.tsx
 * @Description:
 */
import { Image, Text, View } from "@tarojs/components";
import React from "react";
import "./inviteCom.less";
import { sendPoint } from "@/utils/sendPoint";
import Taro from "@tarojs/taro";
import { useStoreState } from "@/hooks";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
const InviteCom = () => {
  const {
    global: { userType },
  } = useStoreState();
  const [renderPhoneAuthButton] = usePhoneAuthorization();
  /**
   * 跳转邀请好友页面
   * @param e
   */
  const navToInvite = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (userType != "2") return;
    sendPoint({
      pageid: "mine",
      event: "click",
      ctrl: "invite",
    });

    Taro.navigateTo({
      url: "/pages/invite-good-friend/index",
    });
  };
  return (
    <View className="invite_friend_get_combo" onClick={navToInvite}>
      <View className="invite_friend_get_combo_wrap">
        <View className="left_side">
          <Image
            src={require("@/assets/images/invite_friend.png")}
            className="icon"
          />
          <Text className="title">邀请好友得套餐</Text>
        </View>
        <View className="right_side">
          <Text>去邀请</Text>
        </View>
      </View>
      {userType !== "2" ? renderPhoneAuthButton() : null}
    </View>
  );
};
export default InviteCom;
