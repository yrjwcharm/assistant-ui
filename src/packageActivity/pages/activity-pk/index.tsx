import React, { CSSProperties, FC, useEffect, useState } from "react";
import { ScrollView, View, Image, Text } from "@tarojs/components";

import "./index.less";
import { useStoreState } from "@/hooks";
import Taro, { useDidShow } from "@tarojs/taro";

import { defaultUser, pageDetail } from "./services";

import { AtNoticebar } from "taro-ui";
import TopComp from "./components/top-comp";
import StartCard from "./components/start-card";
import ImgCard from "./components/img-card";

import RankingCard from "./components/ranking-card";
import ListCard from "./components/list-card";
import Button from "@/components/Button";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import ToastCom from "@/components/ToastCom";
import ReceivePrizesQrcode from "./components/receive-prizes-qrcode";

interface IProps {
  changeDidShowDo?: () => any;
}

/*
 * PK活动的模块组成
 * 1:activity_intro:活动介绍
 * 2:activity_end_content-活动结束说明
 * 3:activity_applying_content:报名中内容
 * 4:activity_method:活动玩法
 * 5:activity_playing_content:比赛中内容
 * 6:before_schedule_content:往期比赛内容
 * 7:activity_rule:活动规则
 * 8:activity_to_reserve:没有活动时展示（立即预约）
 */
let didShowDo: boolean = false;

const ActivityPk: FC<IProps> = ({ changeDidShowDo }) => {
  const {
    global: { userType },
  } = useStoreState();

  const [toastText, setToastText] = useState<string>("");

  const [defaUserInfo, setDefaUserInfo] = useState<
    {
      head_img: string;
      mobile: string;
      remark: string;
    }[]
  >([]); // 顶部弹幕报名提醒用户信息
  const [pageCard, setPageCard] = useState<
    {
      [key: string]: any;
    }[]
  >([]);

  const [activityId, setActivityId] = useState<string | number>(); // 活动id
  const [userStatus, setUserStatus] = useState<string | number>(); // 当前活动下用户状态=>0: 未报名; 1: 已报名; 2: 比赛中; 3: 已结束;

  const [renderPhoneAuthButton] = usePhoneAuthorization();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string>(""); // 领取奖品的二维码

  const getDefaultUser = async () => {
    try {
      const res = await defaultUser();
      setDefaUserInfo(res?.userList || []);
    } catch (error) {}
  };

  const init = async () => {
    try {
      const res = await pageDetail();
      setPageCard(res?.activity_module || []);
      setActivityId(res.activity_id);
      setUserStatus(res.user_status);
      setQrCode(res.accept_prize_step || "");
    } catch (error) {}
    Taro.hideLoading();
    didShowDo = false;
    changeDidShowDo && changeDidShowDo();
  };

  const getCard = (item: any, index: number) => {
    const _style: string | CSSProperties | undefined =
      index === 1
        ? {
            position: "relative",
            zIndex: 2,
            marginTop: "-254rpx",
          }
        : { position: "relative", zIndex: 2 };
    switch (Object.keys(item)[0]) {
      case "activity_intro": // 活动介绍
        return <TopComp imgUrl={item.activity_intro} />;
      case "activity_end_content": // 活动结束说明
        return (
          <View
            style={{
              marginTop: "12rpx",
              padding: "0 32rpx",
              ..._style,
            }}
          >
            <ImgCard imgUrl={item.activity_end_content} />
          </View>
        );
      case "activity_applying_content": // 报名中内容
        // setScheduleId(item.activity_applying_content.schedule_id);
        return (
          <View
            style={{
              padding: "0 32rpx",
              ..._style,
            }}
          >
            {activityId ? (
              <StartCard
                info={item.activity_applying_content}
                activity_id={activityId}
                user_status={userStatus!}
                failFun={() => {
                  setToastText("报名失败，已经参与过该活动");
                  setTimeout(() => {
                    setToastText("");
                  }, 1500);
                }}
              />
            ) : null}
          </View>
        );
      case "activity_method": // 活动玩法
        return (
          <View
            style={{
              marginTop: "12rpx",
              padding: "0 32rpx",
              ..._style,
            }}
          >
            <ImgCard imgUrl={item.activity_method} />
          </View>
        );
      case "activity_playing_content": // 比赛中内容
        return (
          <View
            style={{
              marginTop: "12rpx",
              padding: "0 32rpx",
              ..._style,
            }}
          >
            {activityId ? (
              <RankingCard
                info={item.activity_playing_content}
                activity_id={activityId}
              />
            ) : null}
          </View>
        );
      case "before_schedule_content": // 往期比赛内容
        return (
          <View
            style={{
              marginTop: "12rpx",
              padding: "0 32rpx",
              ..._style,
            }}
          >
            <ListCard info={item.before_schedule_content} />
          </View>
        );
      case "activity_rule": // 活动规则
        return (
          <View
            style={{
              marginTop: "12rpx",
              padding: "0 32rpx",
              ..._style,
            }}
          >
            <ListCard info={item.activity_rule} />
          </View>
        );
      case "activity_to_reserve": // 没有活动时展示（立即预约）
        return (
          <View
            style={{
              marginTop: "12rpx",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: "40rpx",
              ..._style,
            }}
          >
            <View
              style={{
                width: "570rpx",
                borderRadius: "44rpx",
                overflow: "hidden",
              }}
            >
              {userType !== "2" ? renderPhoneAuthButton() : null}
              <Button type="red">{item.activity_to_reserve}</Button>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  useDidShow(() => {
    didShowDo = true;
    init();
    getDefaultUser();
  });

  useEffect(() => {
    if (!didShowDo) {
      init();
      getDefaultUser();
    }
  }, [userType]);

  useEffect(() => {
    Taro.showLoading({
      title: "加载中...",
    });
  }, []);

  // @ts-ignore
  return (
    <View id="activity-pk">
      <ScrollView
        style={{
          width: "100%",
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "#D92222",
        }}
        scrollY
      >
        {defaUserInfo && defaUserInfo?.length > 0 ? (
          <View className="at-noticebar-view">
            <AtNoticebar marquee>
              <View className="at-noticebar-content">
                {defaUserInfo?.map((item) => {
                  return (
                    <View
                      style={{
                        marginRight: "24rpx",
                      }}
                    >
                      {item?.head_img ? <Image src={item.head_img} /> : null}
                      <Text>
                        {item?.mobile} {item?.remark}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </AtNoticebar>
          </View>
        ) : null}
        <View
          style={{
            paddingBottom: "32rpx",
          }}
        >
          {pageCard?.map((item, index) => {
            return getCard(item, index);
          })}
        </View>
      </ScrollView>
      <ToastCom status={toastText ? true : false} text={toastText} />
      {qrCode ? (
        <View
          className="receive-prizes"
          onClick={() => {
            setShowModal(true);
          }}
        >
          <View>领取</View>
          <View>参与奖</View>
        </View>
      ) : null}
      <ReceivePrizesQrcode
        visible={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        imgUrl={qrCode}
      />
    </View>
  );
};

export default ActivityPk;
