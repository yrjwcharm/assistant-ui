import React, { useCallback, useEffect, useState } from "react";

import { View, Text, Image } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import { useStoreState } from "@/hooks";
import CommonModal from "@/components/CommonModal";
import { sendPoint } from "@/utils/sendPoint";
import { defaultshareInfo } from "@/config/variables";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { getUserInfo } from "@/utils/getUserInfo";
import {
  callFamilyFinanceClassApi,
  callFamilyFinanceClassListApi,
} from "./services";
import LessionList, { ILession } from "./lessions";
import "./index.less";
import { FixedView } from "@taroify/core";
import { screenBottom } from "@/config/layoutSize";
import LoadingTip from "@/components/Loading/Loading";

const FamilyFinanceClass = () => {
  const {
    global: { userType },
  } = useStoreState();

  const [index, setIndex] = useState(0);
  const [tabList, setTabList] = useState([
    { text: "详情", isActive: true },
    { text: "课程表", isActive: false },
  ]);
  const [background, setBackground] = useState("");
  const [wechatPopUp, setWeChatPopUp] = useState("");
  const [bottomButton, setBottomButton] = useState("");
  const [detail, setDetail] = useState([]);
  const [lessonList, setLessonList] = useState<ILession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGuide1, setShowGuide1] = useState(false);
  const [showGuide2, setShowGuide2] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [lessionBanner, setLessionBanner] = useState("");

  const [renderPhoneAuthButton] = usePhoneAuthorization({
    afterLoginCb: () => {},
  });

  const isAuth = userType === "2";

  const tabClick = (
    el: { text: string; isActive: boolean },
    index: React.SetStateAction<number>
  ) => {
    tabList.map((item) => {
      item.isActive = false;
      Object.is(item, el) && (item.isActive = true);
    });
    setTabList([...tabList]);
    setIndex(index);
  };
  const init = useCallback(() => {
    (async () => {
      const result = await Promise.all([
        callFamilyFinanceClassApi(),
        callFamilyFinanceClassListApi(),
      ]);
      const [res, res2] = result;
      const { cover = "", children = [] } = res2;
      console.log("res2:", result);

      const {
        weChat_pop_up = "",
        background = "",
        bottom_button = "",
        detail = [],
        is_member = false,
      } = res;
      setBackground(background);
      setWeChatPopUp(weChat_pop_up);
      setBottomButton(bottom_button);
      setDetail(detail);
      setLessonList(children);
      setIsMember(is_member);
      setLessionBanner(cover);
      setLoading(false);
    })();
  }, []);

  useDidShow(() => {
    getUserInfo();
    init();
  });
  useEffect(() => {
    init();
  }, [isAuth, init]);
  useEffect(() => {
    sendPoint({
      pageid: "Coursedetails",
      // ts: ts_in_app,
      ts: Date.now(),
      event: "load",
    });
    // init();
  }, []);
  const log = () => {
    sendPoint({
      pageid: "Coursedetails",
      // ts: ts_in_app,
      ts: Date.now(),
      event: "click",
    });
  };

  const handleOpenLock = () => {
    setShowGuide2(true);
  };
  // @ts-ignore
  useShareAppMessage(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/packageLession/pages/article/index" + path);
  });

  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/packageLession/pages/article/index" + path);
  });
  return (
    <>
      {loading ? (
        <LoadingTip />
      ) : (
        <View
          className="container_class"
          style={{ background: index === 0 ? "#1E5AE7" : "#fff" }}
        >
          <View
            className="content"
            style={{
              paddingBottom: 60 + screenBottom,
            }}
          >
            <View className="tab_header">
              <View className="tab_header_content">
                {tabList.map((el, index) => {
                  return (
                    <View
                      key={el + `` + index}
                      className="tab_wrap"
                      onClick={() => tabClick(el, index)}
                    >
                      <View className="tab_content">
                        <Text
                          style={{
                            color: el.isActive ? "#121D3A" : "#545968",
                            fontFamily: el.isActive
                              ? "PingFangSC-Medium"
                              : "PingFangSC-Regular",
                          }}
                        >
                          {el.text}
                        </Text>
                        <View
                          className="separator"
                          style={{
                            background: el.isActive ? "#121D3A" : "transparent",
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {index == 0 && (
              <>
                <Image src={background} className="header_bg" />
                <View className="class_step">
                  <Image src={detail[0]} className="step1" />
                  <Image src={detail[1]} className="step2" />
                  <Image src={detail[2]} className="step3" />
                </View>
              </>
            )}
            {index == 1 && (
              <View className="lession_step">
                <LessionList
                  banner={lessionBanner}
                  openLock={handleOpenLock}
                  list={lessonList}
                />
              </View>
            )}
          </View>
          {/*弹窗*/}
          {showGuide1 && (
            <View className="fixed_modal">
              <View className="modal">
                <Image
                  src={wechatPopUp}
                  className="weixin"
                  show-menu-by-longpress
                />
                <Image
                  src={require("@assets/images/close_circle.png")}
                  onClick={() => {
                    setShowGuide1(false);
                  }}
                  className="close_circle"
                />
              </View>
            </View>
          )}

          <FixedView
            safeArea="bottom"
            position="bottom"
            style={{
              background: "white",
            }}
          >
            <View className="bottom_wrapper">
              <View
                className="btn_wrap"
                onClick={() => {
                  if (isMember) {
                    setShowGuide1(true);
                    log();
                  } else {
                    setShowGuide2(true);
                    sendPoint({
                      pageid: "Purchaseguide",
                      // ts: ts_in_app,
                      ts: Date.now(),
                      event: "load",
                    });
                  }
                }}
              >
                <Text>{bottomButton}</Text>
              </View>
            </View>
            {!isAuth && renderPhoneAuthButton()}
          </FixedView>
          {showGuide2 && (
            <CommonModal
              index={2}
              title="学习完整课程"
              bool={false}
              openMember={() => {
                setShowGuide2(false);
                sendPoint({
                  pageid: "Purchaseguide",
                  // ts: ts_in_app,
                  ts: Date.now(),
                  event: "click",
                });
                Taro.navigateTo({
                  url: "/pages/member-buy/pay?type=payback&withFound=true&fund_code",
                });
              }}
              closeModal={() => {
                setShowGuide2(false);
              }}
            />
          )}
        </View>
      )}
    </>
  );
};
export default FamilyFinanceClass;
