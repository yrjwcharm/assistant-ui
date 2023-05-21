import { Image, View, Input } from "@tarojs/components";
import React, { useCallback, useEffect, useState } from "react";
import "./index.less";
import HomeNavNav from "@/components/HomeNav";
import CustomTabBar from "@/components/CustomTabBar";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { callIntroInfo } from "@/pages/fund-diagnosis-intro/serivces";
import { updateType } from "@/utils/getUserInfo";
import { useStoreState } from "@/hooks";
import { defaultshareInfo } from "@/config/variables";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import LoadingTip from "@/components/Loading/Loading";
const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight;
const FundDiagnosisIntro = () => {
  const {
    global: { userType },
  } = useStoreState();
  const [renderPhoneAuthButton] = usePhoneAuthorization();
  const [loading, setLoading] = useState(true);
  const [introHeaderBg, setIntroHeaderBg] = useState("");
  const [introImgList, setIntroImgList] = useState([]);
  const [isPopOut, setIsPopOut] = useState(false);
  const [popUp, setPopUp] = useState("");
  const [popBtn, setPopBtn] = useState("");
  const [showGuide, setShowGuide] = useState(true);
  const init = useCallback(() => {
    (async () => {
      const res = await callIntroInfo();
      const {
        background = "",
        intro_img = [],
        is_pop_out = false,
        pop_img: { pop_up = "", button = "" },
      } = res;
      setIntroHeaderBg(background);
      setIntroImgList(intro_img);
      setIsPopOut(is_pop_out);
      setPopUp(pop_up);
      setPopBtn(button);
      setLoading(false);
    })();
  }, [userType]);
  // @ts-ignore
  useShareAppMessage(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/fund-diagnosis-intro/index" + path);
  });

  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/fund-diagnosis-intro/index" + path);
  });
  useEffect(() => {
    init();
  }, [init]);
  return (
    <>
      {loading ? (
        <LoadingTip />
      ) : (
        <View className="diagnosis-intro">
          <View className="fixed_nav">
            <HomeNavNav nohead={true} title="基金理财助手" />
          </View>
          <View
            className="content"
            style={{
              paddingTop: (statusBarHeight as number) + 44,
            }}
          >
            <View
              className="intro_header"
              style={{
                background: `url(${introHeaderBg}) no-repeat`,
                backgroundSize: "cover",
              }}
            >
              <View
                className="search_bar"
                onClick={() => {
                  if (userType == "2") {
                    updateType("fundDiagnose");
                    Taro.navigateTo({
                      url: "/pages/fund-diagnosis/index",
                    });
                  }
                }}
              >
                <Image
                  src={require("@assets/images/search.png")}
                  className="search_icon"
                />
                <Input
                  className="input"
                  disabled={true}
                  placeholder="搜基金代码/名称/经理/公司等"
                  placeholderClass="placeholderClass"
                />
                {userType !== "2" ? renderPhoneAuthButton() : ""}
              </View>
            </View>
            <View className="article">
              <Image src={introImgList[0]} className="img1" />
              <Image src={introImgList[1]} className="img2" />
            </View>
          </View>
          {/*弹窗*/}
          {isPopOut && showGuide && (
            <View className="fixed_modal">
              <View
                className="modal"
                style={{
                  background: `url(${popUp}) no-repeat`,
                  backgroundSize: "cover",
                }}
              >
                <Image
                  src={require("@assets/images/close_circle.png")}
                  onClick={() => {
                    setShowGuide(false);
                  }}
                  className="close_circle"
                />
                <Image
                  src={popBtn}
                  className="pop_btn"
                  onClick={() => {
                    setShowGuide(false);
                  }}
                />
              </View>
            </View>
          )}
          <View className="fixed_tabbar">
            <CustomTabBar path="pages/fund-diagnosis-intro/index" />
          </View>
        </View>
      )}
    </>
  );
};
export default FundDiagnosisIntro;
