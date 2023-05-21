import { View, Image, ScrollView } from "@tarojs/components";
import React, { FC } from "react";

import "./index.less";
import { useStoreState } from "@/hooks";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";

interface IProps {
  imgs: string[];
  button_img?: string;
}

const NotLoginPage: FC<IProps> = ({ imgs, button_img }) => {
  const {
    global: { userType }
  } = useStoreState();

  const [renderPhoneAuthButton] = usePhoneAuthorization();

  return (
    <View className="not-login-page">
      <ScrollView
        scrollY
        style={{
          width: "100%",
          height: "100%",
          position: "relative"
        }}
      >
        <View
          style={{
            width: "100%",
            paddingBottom: "138rpx",
            position: "absolute",
            top: 0,
            left: 0
          }}
        >
          {/* {[hold1].map(item => {
            return (
              <Image
                mode="widthFix"
                src={item}
                style={{
                  width: "100%"
                }}
              />
            );
          })} */}
        </View>
        <View
          style={{
            width: "100%",
            paddingBottom: "138rpx",
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column"
          }}
        >
          {imgs?.map(item => {
            return (
              <Image
                mode="widthFix"
                src={item}
                style={{
                  width: "100%"
                }}
              />
            );
          })}
        </View>
      </ScrollView>
      {button_img ? (
        <View className="login-btn">
          <View
            style={{
              position: "relative"
            }}
          >
            {userType !== "2" ? renderPhoneAuthButton() : null}
            <Image src={button_img} mode="widthFix" />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default NotLoginPage;
