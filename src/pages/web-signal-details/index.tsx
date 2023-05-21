import { useStoreState } from "@/hooks";
import { getLocalToken } from "@/utils/local";
import { Image, Text, View, WebView } from "@tarojs/components";
import Taro, { useDidShow, useRouter, useShareAppMessage } from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { isEmpty } from "@/utils/EmptyUtil";
import { h5BaseURL } from "@/config";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { getQueryParams } from "@/utils/url";
import "./index.less";
import { useUnmount } from "taro-hooks";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import WebViewBridge from "@/utils/webview";
let timer: string | number | NodeJS.Timeout | undefined;
const WebSignalDetails = () => {
  const {
    global: { userType },
  } = useStoreState();
  const [renderPhoneAuthButton] = usePhoneAuthorization();
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const [invite_img, setInviteImg] = useState("");
  const [path, setPath] = useState("");
  const [title, setTitle] = useState("");
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: router.params.title || "买卖点信号详情",
    });
  }, []);

  useEffect(() => {
    if (+userType == 2) {
      //从分享卡片过来的参数
      const { fund_code, is_cover } =
        Taro.getCurrentInstance().router?.params ?? {};
      //从经过 url=encodeURIComponent(url) 编码形式过来的
      let params: { fund_code?: string; is_cover?: string } = getQueryParams(
        decodeURIComponent(router.params.url ?? "")
      );
      (async () => {
        //获取分享卡片参数必传fund_code
        const res = await callInviteCard({
          share_page: "buySignal_invite_page",
          fund_code: params.fund_code || fund_code,
        });
        const { invite_img, path, title } = res?.invite_info;
        setInviteImg(invite_img);
        setPath(path + `&is_cover=${params.is_cover ?? 0}`);
        setTitle(title);
        //添加加is_cover字段、重新修改url
        let url =
          h5BaseURL +
          `fund-assistant/signal-details?token=${getLocalToken()}&fund_code=${fund_code}&chn=mini_program&did=${Taro.getStorageSync(
            "did"
          )}&isFree=${true}&is_cover=${is_cover}`;
        setUrl(router.params.url ?? encodeURIComponent(url));
        //存储url用于买卖点详情界面刷新
        Taro.setStorageSync(
          "signalUrl",
          router.params.url ?? encodeURIComponent(url)
        );
      })();
    }
  }, [userType]);
  useDidShow(() => {
    //解锁成功后刷新h5页面
    Taro.eventCenter.on("buy_trigger", () => {
      const url = Taro.getStorageSync("signalUrl");
      let newUrl = decodeURIComponent(url) + `&timestamp=${+new Date()}`;
      setUrl("");
      timer = setTimeout(() => {
        setUrl(encodeURIComponent(newUrl));
      }, 500);
    });

    Taro.eventCenter.trigger("page_show");
  });
  useUnmount(() => {
    Taro.eventCenter.off("buy_trigger");
    timer && clearTimeout(timer);
  });

  useShareAppMessage((_res) => {
    return {
      title,
      path,
      imageUrl: invite_img,
    };
  });

  Taro.useShareTimeline(() => {
    return {
      title,
      path,
      imageUrl: invite_img,
    };
  });
  return (
    <>
      {userType !== "2" && (
        <View className="cover_mask">
          <Image
            src={
              "https://static.licaimofang.com/wp-content/uploads/2023/02/mask_2_10.png"
            }
            className="mask"
          />
          <View className="btn">
            <Text>点击登录查看买卖点详情</Text>
          </View>
          {userType !== "2" ? renderPhoneAuthButton() : ""}
        </View>
      )}
      {!isEmpty(url) && userType === "2" && (
        <WebView
          onMessage={(e) => {
            WebViewBridge.handleOnMessage(e);
            WebViewBridge.handleMsg(e);
          }}
          src={decodeURIComponent(url)}
        />
      )}
    </>
  );
};

export default WebSignalDetails;
