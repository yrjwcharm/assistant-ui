import { useStoreDispatch, useStoreState } from "@/hooks";
import {
  getLocalToken,
  getStorage,
  removeStorage,
  setLocalToken,
  setLocalUid,
  setLocalUserType,
  setStorage,
} from "@/utils/local";
import {
  Button,
  CoverView,
  Image,
  Text,
  View,
  WebView,
} from "@tarojs/components";
import Taro, { useDidShow, useRouter, useShareAppMessage } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { getQueryParams } from "@/utils/url";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { h5BaseURL } from "@/config";
import { Toast } from "@/components/Toast";
import request from "@/utils/request";
import { getUserInfo } from "@/utils/getUserInfo";
import { changeTabBar } from "@/utils/changeTabBar";
import { isEmpty } from "@/utils/EmptyUtil";
import "./index.less";
import { sendPoint } from "@/utils/sendPoint";
const WebDiagnosticReport = () => {
  const {
    global: { userType },
  } = useStoreState();

  const token = getLocalToken();
  const router = useRouter();
  const dispatch = useStoreDispatch();
  const [code, setCode] = useState("");
  const [invite_img, setInviteImg] = useState("");
  const [title, setTitle] = useState("");
  const [path, setPath] = useState("");
  const [, setSrc] = useState<string>();
  const isIphoneX = Taro.getStorageSync("isIphoneX");
  const [url, setUrl] = useState("");
  Taro.setNavigationBarTitle({
    title: router.params.title || "基金诊断报告",
  });

  useEffect(() => {
    // Taro.showLoading({
    //   title: "加载中..."
    // });
    // @ts-ignore
    if (router?.params?.verify_login !== "false") {
      if (userType !== "2" || !token) {
      } else {
        // @ts-ignore
        const { fund_code } = Taro.getCurrentInstance().router.params;
        fund_code && setStorage("fund_code", fund_code);

        // @ts-ignore
        let params: { fund_code: string } = getQueryParams(
          decodeURIComponent(router.params.url)
        );
        (async () => {
          const res = await callInviteCard({
            share_page: "diagnose_invite_page",
            fund_code: params["fund_code"] || fund_code,
          });
          const { invite_img, path, title } = res?.invite_info;
          setInviteImg(invite_img);
          setPath(path);
          setTitle(title);
          let url =
            h5BaseURL +
            `fund-assistant/diagnostic-report?token=${token}&fund_code=${fund_code}&chn=mini_program&did=${Taro.getStorageSync(
              "did"
            )}&isFree=${true}`;
          setUrl(router.params.url || url);
        })();
      }
    }

    return () => {
      if (getStorage("web-diagnostic-report")) {
        removeStorage("web-diagnostic-report");
      }
    };
  }, [userType]);
  useDidShow(() => {
    Taro.login({
      success: (res) => {
        setCode(res.code);
      },
      fail: () => {},
    });
  });
  useEffect(() => {
    setSrc(`${router.params.url}`);
  }, [router]);
  useShareAppMessage((_res) => {
    return {
      title,
      path,
      imageUrl: invite_img,
    };
  });

  // @ts-ignore
  Taro.useShareTimeline((_res: any) => {
    return {
      title,
      path,
      imageUrl: invite_img,
    };
  });
  const onGetPhoneNumber = (e: {
    detail: { errMsg: string; encryptedData: string; iv: string };
  }) => {
    if (e?.detail?.errMsg.indexOf("ok") !== -1) {
      const _params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      };
      login({
        code,
        ..._params,
      });
    } else {
      Toast.fail("已取消手机号授权");
    }
  };
  const phoneLogin = (data: {
    code: string;
    encryptedData: string;
    iv: string;
  }) => {
    const _initQuery_str: any = getStorage("initQuery");
    return request("/assistant/user/mini/phoneLogin2", {
      method: "POST",
      data: {
        ad_info: _initQuery_str || null,
        ...data,
      },
    });
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
      changeTabBar(); // 初始化tabbar
      let url =
        h5BaseURL +
        `fund-assistant/diagnostic-report?token=${
          res.token
        }&fund_code=${getStorage(
          "fund_code"
        )}&chn=mini_program&did=${Taro.getStorageSync("did")}&isFree=${true}`;
      setUrl(url);
      Taro.hideLoading();
    } catch (error) {
      Taro.login({
        success: (res) => {
          setCode(res.code);
        },
        fail: () => {},
      });
      Taro.hideLoading();
    }
  };
  return (
    <>
      {userType !== "2" && (
        <View className="cover_mask">
          <Image
            src={`https://static.licaimofang.com/wp-content/uploads/2022/12/ass-2-share2-diagnosis.png`}
            className="mask"
          />
          <View className="btn">
            <Text>点击登录查看基金诊断详情</Text>
          </View>
          <Button
            className="auth_login"
            openType="getPhoneNumber"
            onGetPhoneNumber={onGetPhoneNumber}
          />
        </View>
      )}
      {!isEmpty(url) && userType === "2" && (
        <WebView
          onLoad={() => {
            setStorage("web-signal-details", "1");
            Taro.hideLoading();
          }}
          onMessage={(e) => {
            const msgs = e.detail.data;
            msgs.forEach((m) => {
              if (m.type === "umeng")
                sendPoint({
                  ...m.params,
                  isFromH5: true,
                });
            });
          }}
          src={decodeURIComponent(url)}
        >
          <CoverView
            className="fixed-button"
            style={isIphoneX ? "height:77PX" : "height:60PX"}
          >
            <Button className="tool-btn" openType={"share"}>
              将这支基金，推荐给你的朋友。
            </Button>
          </CoverView>
        </WebView>
      )}
    </>
  );
};

export default WebDiagnosticReport;
