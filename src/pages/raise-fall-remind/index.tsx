import React, { useEffect, useState } from "react";
import { View, Text, Input, Switch, Radio } from "@tarojs/components";
import "./index.less";
import { FixedView } from "@taroify/core";
import Taro from "@tarojs/taro";
import {
  callMsgRemindSaveApi,
  callMsgRemindSettingApi,
} from "@/pages/raise-fall-remind/services";
import dayjs from "dayjs";
import { decorationColor } from "@/utils/common";
const RaiseFallRemind = () => {
  const isIphoneX = Taro.getStorageSync("isIphoneX");
  const [fund_name, setFundName] = useState<string>("");
  const [fund_code, setFundCode] = useState<string>("");
  const [nav, setNav] = useState<string>("");
  const [gain, setGain] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [dayRiseOpen, setDayRiseOpen] = useState<boolean>(false);
  const [dayFallOpen, setDayFallOpen] = useState<boolean>(false);
  const [navRiseOpen, setNavRiseOpen] = useState<boolean>(false);
  const [navFallOpen, setNavFallOpen] = useState<boolean>(false);
  const [timeOne, setTimeOne] = useState<boolean>(false);
  const [timeTwo, setTimeTwo] = useState<boolean>(false);
  const [timeThree, setTimeThree] = useState<boolean>(true);
  const [timeFour, setTimeFour] = useState<boolean>(false);
  const [sendTime, setSendTime] = useState<string>("");
  const [dayRiseNum, setDayRiseNum] = useState<string>("");
  const [dayFallNum, setDayFallNum] = useState<string>("");
  const [navRiseNum, setNavRiseNum] = useState<string>("");
  const [navFallNum, setNavFallNum] = useState<string>("");
  const [allSync, setAllSync] = useState<boolean>(false);
  const [sendType, setSendType] = useState<number>(3);
  const [remindInfo, setRemindInfo] = useState<TMindInfo>({
    all_sync_open: 0,
    bullet_screen_open: 0,
    day_fall_rate_num: "",
    day_fall_rate_open: 0,
    day_rise_rate_num: "",
    day_rise_rate_open: 0,
    expect_rise_fall: 0,
    nav_fall_num: "",
    nav_fall_open: 0,
    nav_rise_num: "",
    nav_rise_open: 0,
    send_time: "",
    send_type: 0,
  });
  useEffect(() => {
    (async () => {
      const {
        fund_code = "",
        fund_name = "",
        nav = "",
        gain = "",
        date = "",
      } = Taro.getCurrentInstance()?.router?.params ?? {};
      setFundCode(fund_code);
      setFundName(fund_name);
      setNav(nav);
      setGain(gain);
      setDate(date);
      const res = await callMsgRemindSettingApi({
        fund_code: fund_code!,
      });
      setRemindInfo(res);
      setDayRiseOpen(res.day_rise_rate_open == 1);
      setDayFallOpen(res.day_fall_rate_open == 1);
      setNavRiseOpen(res.nav_rise_open == 1);
      setNavFallOpen(res.nav_fall_open == 1);
    })();
  }, []);
  const save = async () => {
    const { fund_code = "" } = Taro.getCurrentInstance()?.router?.params ?? {};
    await callMsgRemindSaveApi({
      fund_code,
      day_rise_rate_open: dayRiseOpen ? 1 : 0,
      day_rise_rate_num: dayRiseNum,
      day_fall_rate_open: dayFallOpen ? 1 : 0,
      day_fall_rate_num: dayFallNum,
      nav_rise_open: navRiseOpen ? 1 : 0,
      nav_rise_num: navRiseNum,
      nav_fall_open: navFallOpen ? 1 : 0,
      nav_fall_num: navFallNum,
      send_type: sendType,
      send_time: "",
      all_sync_open: allSync ? 1 : 0,
    });
  };
  return (
    <View
      className="msg_remind_setting_box"
      style={{
        paddingBottom: isIphoneX ? "101px" : "88px",
      }}
    >
      <View className="msg_remind_setting_box_header">
        <View className="top_side">
          <Text className="fund_name">{fund_name}</Text>
          <Text className="fund_code">{fund_code}</Text>
        </View>
        <View className="bottom_side">
          <Text className="nav">
            最新净值({date && dayjs(date).format("MM-DD")})：{nav}
          </Text>
          <Text
            className="nav_color"
            style={{
              color: decorationColor(gain),
            }}
          >
            {gain}
          </Text>
        </View>
      </View>

      <View className="msg_remind_setting_box_section">
        <View className="raise_fall_set">
          <View className="top_side">
            <View className="top_side_wrap">
              <View className="separator" />
              <Text className="title">涨跌幅设置</Text>
            </View>
          </View>
          <View className="bottom_side">
            <View className="top_wrap">
              <View className="left_side">
                <Text className="title">日涨幅超过</Text>
                <Input
                  className="input"
                  value={remindInfo.day_rise_rate_num}
                  type="number"
                />
                <Text className="unit">%</Text>
              </View>
              <Switch
                color="#0051CC"
                style={{
                  transform: "scale(.8)",
                }}
                checked={dayRiseOpen}
              />
            </View>
            <View className="bottom_wrap">
              <View className="left_side">
                <Text className="title">日跌幅超过</Text>
                <Input
                  className="input"
                  value={remindInfo.day_fall_rate_num}
                  type="number"
                />
                <Text className="unit">%</Text>
              </View>
              <Switch
                color="#0051CC"
                style={{
                  transform: "scale(.8)",
                }}
                checked={dayFallOpen}
              />
            </View>
          </View>
        </View>
        <View className="goal_nav_set">
          <View className="top_side">
            <View className="top_side_wrap">
              <View className="separator" />
              <Text className="title">目标净值</Text>
            </View>
          </View>
          <View className="bottom_side">
            <View className="top_wrap">
              <View className="left_side">
                <Text className="title">净值涨到</Text>
                <Input className="input" value={remindInfo.nav_rise_num} />
              </View>
              <Switch
                color="#0051CC"
                style={{
                  transform: "scale(.8)",
                }}
                checked={navRiseOpen}
              />
            </View>
            <View className="bottom_wrap">
              <View className="left_side">
                <Text className="title">净值跌倒 </Text>
                <Input className="input" value={remindInfo.nav_fall_num} />
              </View>
              <Switch
                color="#0051CC"
                style={{
                  transform: "scale(.8)",
                }}
                checked={navFallOpen}
              />
            </View>
          </View>
        </View>
        <View className="time_set">
          <View className="top_side">
            <View className="top_side_wrap">
              <View className="separator" />
              <Text className="title">时间设置</Text>
            </View>
          </View>
          <View className="bottom_side">
            <View className="top">
              <View className="left_side">
                <Radio
                  color="#0051CC"
                  style={{
                    transform: "scale(.7)",
                  }}
                  checked={timeOne}
                />
                <Text className="span">14:30提醒我</Text>
              </View>
              <View className="right_side">
                <Radio
                  color="#0051CC"
                  style={{
                    transform: "scale(.7)",
                  }}
                  checked={timeTwo}
                />
                <Text className="span">14:50提醒我</Text>
              </View>
            </View>
            <View className="center">
              <Radio
                color="#0051CC"
                style={{
                  transform: "scale(.7)",
                }}
                checked={timeThree}
              />
              <Text className="span">随时提醒</Text>
            </View>
            <View className="bottom">
              <Radio
                color="#0051CC"
                style={{
                  transform: "scale(.7)",
                }}
                checked={timeFour}
              />
              <Text className="span">自定义</Text>
              {timeFour && (
                <View className="customize">
                  <Text>14:50</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="sync_all">
          <View className="sync_all_wrap">
            <Text className="title">把该设置同步到所有的持有基金</Text>
            <Switch
              color="#0051CC"
              style={{
                transform: "scale(.8)",
              }}
              checked={false}
            />
          </View>
        </View>
      </View>
      <FixedView
        position="bottom"
        safeArea="bottom"
        style={{
          background: "white",
        }}
      >
        <View className="save_btn" onClick={save}>
          <Text className="title">保存</Text>
        </View>
      </FixedView>
    </View>
  );
};
export default RaiseFallRemind;
