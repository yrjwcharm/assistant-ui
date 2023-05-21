/*
 * @Date: 2023-02-07 15:48:50
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-15 16:23:04
 * @FilePath: /assistant-ui/src/pages/hold/components/List/UnauthList.tsx
 * @Description:
 */
import { Image, View } from "@tarojs/components";
import React  from "react";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import "../../index.less";

// @ts-ignore
export default function UnauthList({ type }) {
  const [renderPhoneAuthButton] = usePhoneAuthorization();
  return (
    <View
      style={{
        width: "100%",
        overflowY: "scroll",
      }}
    >
      <Image
        src={
          "https://static.licaimofang.com/wp-content/uploads/2023/02/hold_default_img.png"
        }
        style={{
          width: "100%",
        }}
        mode="widthFix"
      />
      <View className="hold-red-btn-container">
        <View className="red-btn">
          {renderPhoneAuthButton()}
          <View className="btn-text">
            立即导入{type === 0 ? "持仓" : "关注"}基金
          </View>
          <View className="btn-sub-text">查看买卖点</View>
        </View>
      </View>
    </View>
  );
}
