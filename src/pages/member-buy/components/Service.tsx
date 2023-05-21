/*
 * @Date: 2023-02-06 10:42:10
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-03 15:13:55
 * @FilePath: /assistant-ui/src/pages/member-buy/components/Service.tsx
 * @Description: 联系客服的按钮和弹窗
 */
import React, { useState } from "react";
import { View, Text, Image } from "@tarojs/components";

import "./index.less";
import { useStoreState } from "@/hooks";
const wechatPopUp =
  "https://static.licaimofang.com/wp-content/uploads/2023/03/customer-service.png";

export default function Service() {
  const {
    global: {
      userInfo: { customer_img },
    },
  } = useStoreState();

  const [show, setShow] = useState(false);

  return (
    <View>
      {show && (
        <View className="fixed_modal">
          <View className="modal">
            <Image
              src={customer_img ?? wechatPopUp}
              className="weixin"
              showMenuByLongpress={true}
            />
            <Image
              src={require("@assets/images/close_circle.png")}
              onClick={() => {
                setShow(false);
              }}
              className="close_circle"
            />
          </View>
        </View>
      )}
      <View className="serviceBtnWrap">
        <View className="serviceBtn" onClick={() => setShow(true)}>
          <Text>联系客服</Text>
        </View>
      </View>
    </View>
  );
}
