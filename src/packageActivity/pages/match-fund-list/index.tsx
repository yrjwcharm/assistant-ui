import React, { FC, useEffect, useState } from "react";
import { ScrollView, View } from "@tarojs/components";

import "./index.less";
import Taro, { useDidShow, useRouter, useShareAppMessage } from "@tarojs/taro";
import { defaultshareInfo } from "@/config/variables";
import DefaultGraph from "@/components/DefaultGraph";
import { getFundSnapshot } from "./services";

import getValueColor from "@/utils/getValueColor";
import { sendPoint } from "@/utils/sendPoint";

const pageid: string = "PKholdingfund";
let ts_in: number = 0;

const MatchFundList: FC = () => {
  //activity_id: 活动id schedule_id: 期数id
  const { params } = useRouter();

  const [info, setInfo] = useState<{
    ass_schedule_info: string;
    start_end_date: string;
    update_time: string;
  }>(); // 活动信息

  const [empty, setEmpty] = useState<boolean>(false); // 数据是否为空
  const [list, setList] = useState<
    {
      id: number;
      compete_id: number;
      fund_code: string;
      fund_name: string; //基金名
      ra_date: string;
      day_before_start_nav: string;
      day_before_start_date: string;
      ra_nav: string;
      nav_inc: string;
      proportion: string;
      day_yield: string; //当日收益
      total_yield: string; //累计收益
      created_at: string;
      updated_at: string;
    }[]
  >([]);

  const init = async () => {
    Taro.showLoading();
    try {
      const res = await getFundSnapshot({
        activity_id: params.activity_id!,
        schedule_id: params.schedule_id!
      });
      setInfo(res.info);
      setList(res.list || []);
      if (!res.list || res?.list.length === 0) {
        setEmpty(true);
      }
    } catch (error) {}
    Taro.hideLoading();
  };

  useDidShow(() => {
    ts_in = Date.now();
    sendPoint({
      pageid: pageid,
      ts: ts_in,
      event: "load"
    });
    init();
  });

  useEffect(() => {}, []);

  useShareAppMessage(res => {
    return defaultshareInfo();
  });

  return (
    <View className="activity-match-fund-list">
      <ScrollView scrollY className="match-fund-content">
        <View className="match-fund-top">
          <View className="match-title">{info?.ass_schedule_info}</View>
          <View
            className="match-date"
            style={{
              borderBottom: "1px solid #E9EAEF"
            }}
          >
            <View>收益PK时间：{info?.start_end_date}</View>
            <View>数据更新日期：{info?.update_time || "--"}</View>
          </View>
        </View>
        <View className="match-fund-table">
          <View className="table-head">
            <View className="head first">持有基金</View>
            <View className="head second">
              <View>持仓占比</View>
              <View className="sub-title"> </View>
            </View>
            <View className="head third">
              <View>当日收益率</View>
              <View className="sub-title">{info?.update_time}</View>
            </View>
            <View className="head third">
              <View>累计收益率</View>
              <View className="sub-title">(参赛期间)</View>
            </View>
          </View>
          {empty ? (
            <View
              style={{
                height: "430rpx",
                background: "#fff",
                padding: "0 32rpx"
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <DefaultGraph title="暂无基金数据" />
              </View>
            </View>
          ) : null}
          {!empty && list?.length > 0 ? (
            <View className="table-body">
              {list.map(item => {
                return (
                  <View key={item.fund_code} className="list">
                    <View className="first">
                      <View className="fund-name">{item.fund_name}</View>
                    </View>
                    <View className="second">{item.proportion}%</View>
                    <View
                      className="second"
                      style={{
                        color: item.day_yield
                          ? getValueColor(`${item.day_yield}`)
                          : "#000"
                      }}
                    >
                      <View>
                        {item.day_yield ? `${item.day_yield}%` : "--"}
                      </View>
                      {item.ra_date && item.day_yield ? (
                        <View className="sub-title">{item.ra_date}</View>
                      ) : null}
                    </View>
                    <View
                      className="third"
                      style={{
                        color: item.total_yield
                          ? getValueColor(`${item.total_yield}`)
                          : "#000"
                      }}
                    >
                      {item.total_yield ? `${item.total_yield}%` : "--"}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default MatchFundList;
