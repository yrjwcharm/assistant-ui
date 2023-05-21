import React, { FC, useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";

import "./index.less";

import triangle from "@/packageActivity/assets/images/icon/triangle.png";
import selectedIcon from "@/assets/images/icons/selected-F34540.png";
import noSelected from "@/assets/images/icons/no-selected-2.png";
import Taro from "@tarojs/taro";
import { Toast } from "@/components/Toast";
import { signUp } from "@/utils/signUp";
import { useStoreState } from "@/hooks";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import { sendPoint } from "@/utils/sendPoint";

let countTimer: any = null;
let signUpTimer: any = null;

interface IProps {
  info: StartCardType;
  activity_id: string | number;
  user_status: string | number; // 当前活动下用户状态=>0: 未报名; 1: 已报名; 2: 比赛中; 3: 已结束;
  failFun?: () => any;
}

const StartCard: FC<IProps> = ({ info, activity_id, user_status, failFun }) => {
  const {
    global: { userType },
  } = useStoreState();

  const [renderPhoneAuthButton] = usePhoneAuthorization({
    callback: async () => {
      const res = await signUp(activity_id, info.schedule_id);
      if (res && res == 1) {
        // 报名失败，已经参与过该活动
        failFun && failFun();
      }
    },
  });

  const [headerImgArr] = useState<string[]>([
    "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKPWuQJN0ibDBvVNNticXEnGAibJf7Ud5E0YiaeqWo0181kjltnmRAGHk2OdnfQMKHfMQibDnia40VRmkUQ/132",
    "https://thirdwx.qlogo.cn/mmopen/vi_32/NYfjRelia7DO4QI952lTJEG8PU2KPMGr5rYqz3BbG8EXNkEKsCPiasico1giaqy8oTibooA0yJh0ZS1sd5rsm6rV87A/132",
    "https://thirdwx.qlogo.cn/mmopen/vi_32/xzHDjCSFicNa0pQPIZqqKGjVkfs0SpBPHnDnZ2JKKps7AN3Io3t6rXybW8hcZxOJicC64v6qDl3Jr1UhVicR8Y0hg/132",
    "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLWQz9EGPYRUAr4Px5BlGC9Ee4mQiaguib2UlJia1ibWYEVLzdVBf4L46rB08lMHrvLoq4aZuwnicXGHMw/132",
    "https://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEIStUpTGaKmZOae5RvdZhqkOicNKFcrDiaPYqg0IEHkicEWbP4tLaMX6z9sIehMowK5Ak4UcctdLXNkQ/132",
    "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83ersRDMjGmwJzYyQqkQkiciaL9yVKpnYJtY0C8qO0ftq6rYnFvibQaxmW63WsGwnJBuibM6k7uCrTYMjzA/132",
  ]);

  const [selectStatus, setSelectStatus] = useState<boolean>(false);
  const [endTime, setEndTime] = useState<number[]>(); // 活动报名截止时间
  const [showHead, setShowHead] = useState<boolean>(false); // 头像列表是否显示
  const [countDownTime, setCountDownTime] = useState<string[]>([]); // 活动报名截止时间

  const [signUpStatus, setSignUpStatus] = useState<boolean>(true); // 报名按钮是否可点击

  const countDown = () => {
    if (endTime && endTime.length > 0) {
      let now = new Date();
      let endDate = new Date(
        endTime[0],
        endTime[1],
        endTime[2],
        endTime[3],
        endTime[4],
        endTime[5]
      );
      let leftTime = endDate.getTime() - now.getTime(); // 计算剩余的毫秒数
      if (leftTime <= 0) {
        leftTime = 0;
      }
      let leftsecond = parseInt(`${leftTime / 1000}`); // 计算剩余的秒数
      let day = Math.floor(leftsecond / (60 * 60 * 24));
      let day_text = day < 10 ? `0${day}` : `${day}`;
      let hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600);
      let hour_text = hour < 10 ? `0${hour}` : `${hour}`;
      let minute = Math.floor(
        (leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60
      );
      let minute_text = minute < 10 ? `0${minute}` : `${minute}`;
      let second = Math.floor((leftTime / 1000) % 60);
      let second_text = second < 10 ? `0${second}` : `${second}`;
      // console.log("ceshi", `${day}天${hour}小时${minute}分钟${second}秒`);
      setCountDownTime([day_text, hour_text, minute_text, second_text]);
      // return `${day}天${hour}小时${minute}分钟${second}秒`;
    }
  };

  // const signUp = async () => {
  //   Taro.showLoading();
  //   try {
  //     const res = await registration({
  //       activity_id: activity_id,
  //       schedule_id: info.schedule_id
  //     });
  //     // 0: 报名成功; 1: 已报过名; 2: 没有持仓请去添加;
  //     if (res.status == 0) {
  //       // relaod && relaod();
  //       Toast.info("报名成功");
  //       setTimeout(() => {
  //         Taro.navigateTo({
  //           url: `/packageActivity/pages/match-ranking-list/index?activity_id=${activity_id}&schedule_id=${info.schedule_id}`
  //         });
  //       }, 1000);
  //     } else if (res.status == 1) {
  //       Toast.fail("报名失败，已经参与过该活动");
  //     } else if (res.status == 2) {
  //       Taro.navigateTo({
  //         url: `/packageAddFund/pages/add-fund/index?type=3&activity_id=${activity_id}&schedule_id=${info.schedule_id}`
  //       });
  //     }
  //   } catch (error) {}
  //   Taro.hideLoading();
  // };

  useEffect(() => {
    if (countTimer) {
      clearInterval(countTimer);
      if (endTime && endTime.length > 0) {
        countTimer = setInterval(countDown, 1000);
      }
    } else {
      if (endTime && endTime.length > 0) {
        countTimer = setInterval(countDown, 1000);
      }
    }
  }, [endTime]);

  useEffect(() => {
    if (
      countDownTime[0] === "00" &&
      countDownTime[1] === "00" &&
      countDownTime[2] === "00" &&
      countDownTime[3] === "00" &&
      countTimer
    ) {
      clearInterval(countTimer);
    }
  }, [countDownTime]);

  useEffect(() => {
    if (info?.countdown_info?.countdown_time) {
      try {
        let _endTime_str: string = info?.countdown_info?.countdown_time;
        let _endTime_str_arr: string[] = _endTime_str.split(" ");
        _endTime_str_arr = [
          ..._endTime_str_arr[0].split("-"),
          ..._endTime_str_arr[1].split(":"),
        ];
        const _endTime_num_arr: number[] = _endTime_str_arr.map(
          (item, index) => {
            if (index === 1) {
              return parseInt(item) - 1;
            } else {
              return parseInt(item);
            }
          }
        );
        setEndTime(_endTime_num_arr);
        setShowHead(false);
      } catch (error) {
        setEndTime(undefined);
        setShowHead(true);
      }
    } else {
      setEndTime(undefined);
      setShowHead(true);
    }
  }, [info]);

  useEffect(() => {
    return () => {
      if (countTimer) {
        clearInterval(countTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (!signUpStatus) {
      if (signUpTimer) {
        clearTimeout(signUpTimer);
      }
      signUpTimer = setTimeout(() => {
        setSignUpStatus(true);
      }, 1000);
    }
  }, [signUpStatus]);

  return (
    <View className="start-card">
      <View className="top-title">
        <View className="title-active-info">
          <Text className="active-id">{info?.title}</Text>
          <Text className="active-status">{info?.status_name}</Text>
          <View className="active-triangle">
            <Image src={triangle} />
          </View>
        </View>
        {info?.activity_time_info?.time_info ? (
          <View className="active-end-time">
            <Text>
              {info?.activity_time_info?.time_name}：
              {info?.activity_time_info?.time_info}
            </Text>
          </View>
        ) : null}
      </View>
      {endTime ? (
        <View className="count-down-container">
          <View className="count-down-title">
            {info?.countdown_info?.countdown_name}
          </View>
          <View className="count-down">
            <View className="count-down-card">
              <View className="num">{countDownTime[0] || "00"}</View>
              <View className="text">天</View>
            </View>
            <View className="count-down-card">
              <View className="num">{countDownTime[1] || "00"}</View>
              <View className="text">时</View>
            </View>
            <View className="count-down-card">
              <View className="num">{countDownTime[2] || "00"}</View>
              <View className="text">分</View>
            </View>
            <View className="count-down-card">
              <View className="num">{countDownTime[3] || "00"}</View>
              <View className="text">秒</View>
            </View>
          </View>
        </View>
      ) : null}
      <View className="applicants-nums">
        {showHead ? (
          <View className="head-container">
            {headerImgArr.map((item) => {
              return (
                <View
                  className="head"
                  style={{
                    background: item,
                  }}
                >
                  <Image src={item} />
                </View>
              );
            })}
          </View>
        ) : null}
        {info?.apply_user_info?.user_num ? (
          <View className="nums">
            共有<Text>{info?.apply_user_info?.user_num}</Text>人报名参与
          </View>
        ) : null}
      </View>
      <View className="sign-up-btn">
        {user_status == 1 ? (
          <View
            onClick={() => {
              Taro.navigateTo({
                url: `/packageActivity/pages/match-ranking-list/index?activity_id=${activity_id}&schedule_id=${info.schedule_id}`,
              });
            }}
            style={{
              marginBottom: "24rpx",
            }}
          >
            <View className="title">报名成功</View>
            <View className="sub-title">查看详情</View>
          </View>
        ) : (
          <View
            onClick={() => {
              if (selectStatus) {
                if (userType === "2" && signUpStatus) {
                  setSignUpStatus(false);
                  signUp(activity_id, info.schedule_id);
                }
              } else {
                Toast.fail("请先阅读并同意活动规则");
              }

              sendPoint({
                pageid: "PKhomepage",
                event: "click",
              });
            }}
            style={{
              position: "relative",
            }}
          >
            {userType !== "2" && selectStatus ? renderPhoneAuthButton() : null}
            <View className="title">立即报名</View>
          </View>
        )}
      </View>
      {user_status == 1 ? null : (
        <View className="consent-rules">
          <View
            onClick={() => {
              setSelectStatus(!selectStatus);
            }}
          >
            {selectStatus ? (
              <Image src={selectedIcon} />
            ) : (
              <Image src={noSelected} />
            )}
            <View
              style={{
                height: "100%",
                marginLeft: "12rpx",
                display: "flex",
                alignItems: "center",
              }}
            >
              我已阅读并同意
              <View
                className="link"
                onClick={(e) => {
                  e.stopPropagation();
                  Taro.navigateTo({
                    url: `/packageActivity/pages/activity-rules/index?activity_id=${activity_id}`,
                  });
                }}
              >
                《活动规则》
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(StartCard);
