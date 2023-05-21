/*
 * @Date: 2022-09-16 17:47:23
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-12 14:39:44
 * @FilePath: /assistant-ui/src/packageLession/pages/article/detail.tsx
 * @Description:  三级页面 文章详情
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, Button, ScrollView } from "@tarojs/components";
import Taro, {
  getCurrentInstance,
  useShareAppMessage,
  useDidShow,
} from "@tarojs/taro";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import { useStoreState } from "@/hooks";
import CommonModal from "@/components/CommonModal";
import { sendPoint } from "@/utils/sendPoint";
import { getUserInfo } from "@/utils/getUserInfo";
import "@tarojs/taro/html5.css";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { INo_member_info, IMedio } from "@/packageLession/types";
import { AudioCard } from "../../components/Cards/Audio";
import { VideoCard } from "../../components/Cards/Video";
import {
  callFamilyFinanceClassArticleApi,
  logFamilyFinanceClassStudyApi,
} from "./services";

import "./detail.styl";

Taro.options.html.transformElement = (el: {
  nodeName: string;
  setAttribute: (arg0: string, arg1: string) => void;
}) => {
  if (el.nodeName === "image") {
    el.setAttribute("mode", "widthFix");
  }
  return el;
};

interface IArticleData extends IMedio, INo_member_info {
  author_info: {
    nickname: string;
  };
  title: string;
  content: string;
  id: number;
  cover: string;
  type: 1 | 2 | 3; // 媒体类型

  share_info: {
    button_title: string;
  };
}

export default function Article() {
  /** 详情数据 */
  const [data, setData] = useState<IArticleData>();

  const {
    global: { userType, userInfo },
  } = useStoreState();

  const [showUpLevel, setShowUpLevel] = useState(false);
  const [articleId, setArtcleId] = useState<any>();
  const processRef = useRef({
    sum_duration: 0,
    study_duration: 0,
    is_finish: "0",
  });

  const [renderPhoneAuthButton] = usePhoneAuthorization();

  const isAuth = userType === "2";
  const isTry = userInfo.is_member === 0;

  console.log("isAuth:", isAuth, "isTry:", isTry);

  useDidShow(() => {
    getUserInfo();
  });

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: "" });
    const params = getCurrentInstance().router?.params ?? {};
    const { article_id, from } = params;

    if (!article_id) {
      if (from === "list" || from === "home") {
        Taro.navigateBack({
          delta: 1,
        });
      } else {
        Taro.redirectTo({
          url: "/pages/hold/index",
        });
      }
    }
    setArtcleId(article_id);

    Taro.eventCenter.on("process_change", (info) => {
      console.log("process_change:", info);
      processRef.current = {
        sum_duration: info.sum_duration,
        study_duration: info.study_duration,
        is_finish: info.is_finish,
      };
    });

    return () => {
      Taro.eventCenter.off("process_change");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!articleId) return;
    async function getData() {
      const res = await callFamilyFinanceClassArticleApi({
        article_id: articleId,
      });
      setData(res);
    }

    getData();
    doRecord();
  }, [articleId]);

  const doRecord = useCallback(() => {
    if (!userType || userType !== "2") return;
    if (!articleId) return;
    logFamilyFinanceClassStudyApi({
      article_id: articleId,
      is_finish: processRef.current.is_finish,
      sum_duration: processRef.current.sum_duration,
      study_duration: processRef.current.study_duration,
    });
  }, [articleId, processRef, userType]);

  useEffect(() => {
    if (!userType || userType !== "2") return;
    if (!articleId || !data) return;

    const timer = setInterval(() => {
      doRecord();
    }, 60 * 1000);

    return () => {
      clearInterval(timer);
    };
  }, [articleId, data, doRecord, userType]);

  // @ts-ignore
  useShareAppMessage(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "familyFinances_invite_page",
      article_id: articleId,
    });
    const { invite_img, path, title } = res?.invite_info;

    return {
      title,
      path,
      imageUrl: invite_img,
    };
  });

  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "familyFinances_invite_page",
      article_id: articleId,
    });
    const { invite_img, path, title } = res?.invite_info;
    return {
      title,
      path,
      imageUrl: invite_img,
    };
  });

  const handleTryUpLevel = () => {
    setShowUpLevel(true);
  };

  const handleArticleEnd = () => {
    console.log("handleArticleEnd");
    if (!data || data.type !== 1) return;
    if (!userType || userType !== "2") return;
    if (!userInfo || userInfo.is_member !== 1) return;
    processRef.current = {
      sum_duration: 0,
      study_duration: 0,
      is_finish: "1",
    };
    doRecord();
  };

  useEffect(() => {
    Taro.showShareMenu({
      withShareTicket: true,
    });
  });

  if (!data || !userType) return null;

  return (
    <ScrollView
      scrollY={isAuth}
      scrollWithAnimation
      lowerThreshold={50}
      className="page-scroll"
      onScrollToLower={handleArticleEnd}
      style={isAuth ? {} : { overflow: "hidden", height: "100vh" }}
    >
      <View className="articleContainer">
        <View className="articleHeader">
          <Text className="title">{data.title}</Text>
          <Text className="from">来源：{data.author_info.nickname}</Text>
        </View>

        <View style={{ position: "relative" }}>
          {data.media_url && data.type === 2 && (
            <AudioCard
              title={data.title}
              media_url={data.media_url}
              media_cover={data.media_cover}
              media_duration={data.media_duration}
              isTry={isTry}
              no_member_info={data.no_member_info}
              tryUpLevel={handleTryUpLevel}
            />
          )}
          {data.media_url && data.type === 3 && (
            <VideoCard
              title={data.title}
              media_duration={data.media_duration}
              media_cover={data.media_cover}
              media_url={data.media_url}
              isTry={isTry}
              no_member_info={data.no_member_info}
              tryUpLevel={handleTryUpLevel}
            />
          )}

          <View className="articleContent">
            <View
              className={`taro_html ${!isTry && isAuth ? "full" : ""}`}
              dangerouslySetInnerHTML={{ __html: data.content }}
            ></View>

            {isTry && data.content && (
              <View className="tryArticleContent">
                <View className="header">
                  <View className="line"></View>
                  <Text className="endTitle">
                    {data.no_member_info.see_end_title_txt}
                  </Text>
                  <View className="line"></View>
                </View>
                {data.type === 1 && (
                  <View className="content">
                    <View className="upBtn" onClick={handleTryUpLevel}>
                      <Text className="upBtn_text">
                        {data.no_member_info.see_end_button_title}
                      </Text>
                    </View>
                    <View className="descWrap">
                      {(data.no_member_info?.introduce_content || []).map(
                        (t) => (
                          <Text className="desc">{t}</Text>
                        )
                      )}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
          {userType === "0" && (
            <View className="modal">
              <Button className="button">点击登录查看课程内容</Button>
              {renderPhoneAuthButton()}
            </View>
          )}
        </View>
      </View>
      {userType !== "0" && (
        <View className="articleFooter">
          <Button className="btnwrap" open-type="share">
            <Text className="text">{data.share_info.button_title}</Text>
          </Button>
        </View>
      )}

      {showUpLevel && (
        <CommonModal
          index={2}
          title="学习完整课程"
          bool={false}
          openMember={() => {
            setShowUpLevel(false);
            sendPoint({
              pageid: "Purchaseguide",
              // ts: ts_in_app,
              ts: Date.now(),
              event: "click",
            });
            Taro.navigateTo({
              url: "/pages/member-buy/pay?type=payback",
            });
          }}
          lookSample={undefined}
          closeModal={() => {
            setShowUpLevel(false);
          }}
        />
      )}
    </ScrollView>
  );
}
