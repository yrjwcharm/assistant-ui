import Taro, { useDidShow } from "@tarojs/taro";
import React, { FC, useEffect, useState } from "react";
import {
  View,
  Image,
  Button as AtButton,
  Text,
  ScrollView,
} from "@tarojs/components";

import "./index.less";

// import img from "./img.png";
import Button from "@/components/Button";
import { Toast } from "@/components/Toast";
import { phoneLogin } from "./services";
import { setLocalToken, setLocalUid, setLocalUserType } from "@/utils/local";
import { useStoreDispatch } from "@/hooks";
import { getUserInfo } from "@/utils/getUserInfo";

import selected from "@/assets/images/icons/selected.png";
import noSelected from "@/assets/images/icons/no-selected.png";
import UploadModal from "./components/UploadModal";
import { sendPoint } from "@/utils/sendPoint";

const BindPhone: FC = () => {
  const dispatch = useStoreDispatch();

  const [agree, setAgree] = useState<boolean>(false); // 是否阅读并同意用户协议
  const [code, setCode] = useState<string>(""); // 获取code

  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    title: string; //赠送权益成功后提示标题
    content: string; //赠送权益成功后提示内容
    jump_url: string; //赠送权益成功后跳转链接
    jump_description: string; //赠送权益成功后跳转描述
  }>();

  const onGetPhoneNumber = (e: {
    detail: { errMsg: string; encryptedData: string; iv: string };
  }) => {
    if (e?.detail?.errMsg.indexOf("ok") !== -1) {
      const _params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      };

      login({
        code: code,
        ..._params,
      });
    } else {
      Toast.fail("已取消手机号授权");
    }
  };

  const login = async (params: {
    code: string;
    encryptedData: string;
    iv: string;
  }) => {
    Taro.showLoading({
      title: "加载中...",
    });

    try {
      const res = await phoneLogin(params);

      setLocalToken(`${res.token}`);
      setLocalUserType(`${res.user_type}`);
      setLocalUid(`${res.uid}`);
      dispatch({
        type: "global/setUserType",
        payload: `${res.user_type}`,
      });
      getUserInfo(); // 获取用户信息

      setModalData(res.pop_content);
      setIsOpened(true);

      sendPoint({
        ts: Date.now(),
        event: "phoneempowerregister",
      });
    } catch (error) {
      Taro.login({
        success: (res) => {
          setCode(res.code);
        },
        fail: () => {
          // Toast.fail("获取code失败");
        },
      });
    }

    Taro.hideLoading();
  };

  // 兼容在子组件中的情况
  useEffect(() => {
    Taro.login({
      success: (res) => {
        setCode(res.code);
      },
      fail: () => {
        // Toast.fail("获取code失败");
      },
    });
  }, []);

  useDidShow(() => {
    Taro.login({
      success: (res) => {
        setCode(res.code);
      },
      fail: () => {
        // Toast.fail("获取code失败");
      },
    });
  });

  return (
    <ScrollView scrollY className="bind-container">
      <View className="title">绑定手机号</View>
      <View className="subtitle">还差一步即可查看基金买卖点信号</View>

      <View
        style={{
          padding: "0 40rpx",
          marginTop: "28rpx",
        }}
      >
        <Image
          src={
            "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_img.png"
          }
          style={{
            width: "100%",
          }}
          mode="widthFix"
        />
      </View>

      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginTop: "32rpx",
        }}
      >
        <View
          style={{
            width: "400rpx",
          }}
        >
          <Button
            onClick={() => {
              if (!agree) {
                Taro.showModal({
                  content: "请先阅读并同意用户协议",
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                    }
                  },
                });
              }
            }}
          >
            {agree ? (
              <AtButton
                open-type="getPhoneNumber"
                onGetPhoneNumber={onGetPhoneNumber}
              >
                绑定手机号
              </AtButton>
            ) : (
              "绑定手机号"
            )}
          </Button>

          <View
            className="agree-container"
            onClick={() => {
              setAgree(!agree);
            }}
          >
            <Image src={agree ? selected : noSelected} />
            <Text>我已阅读并同意</Text>
            <Text
              style={{
                color: "#0051CC",
              }}
              onClick={(e) => {
                e.stopPropagation();
                // const url = encodeURIComponent(
                //   "https://market-saas.licaimofang.com/saash5/user-agreement"
                // );
                // Taro.navigateTo({
                //   url: `/pages/web-view/index?url=${url}&title=理财魔方用户协议&verify_login=false`
                // });
                Taro.navigateTo({
                  url: `/packagePage/pages/user-agreement/index`,
                });
              }}
            >
              《用户协议》
            </Text>
          </View>
        </View>
      </View>

      <UploadModal isOpened={isOpened} modalData={modalData!} />
    </ScrollView>
  );
};

export default BindPhone;
