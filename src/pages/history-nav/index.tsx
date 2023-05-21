import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import "./index.less";
import { decorationColor } from "@/utils/common";
import { callHistoryNaviApi } from "@/pages/history-nav/service";
import Taro from "@tarojs/taro";
import LoadingTip from "@/components/Loading/Loading";
const HistoryNav = () => {
  const [navList, setNavList] = useState([]);
  const isIphoneX = Taro.getStorageSync("isIphoneX");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const { fund_code, period, fund_name } = Taro.getCurrentInstance().router
        ?.params ?? { fund_code: "", period: "", fund_name: "" };
      Taro.setNavigationBarTitle({
        title: fund_name!,
      });
      const res = await callHistoryNaviApi({
        fund_code: fund_code!,
        period: period!,
      });
      setLoading(false);
      setNavList(res?.fund_list?.navs ?? []);
    })();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingTip />
      ) : (
        <View
          className="history_nav_box"
          style={{
            marginBottom: isIphoneX ? "101px" : "67px",
          }}
        >
          <View className="profit_header">
            <View className="wrap">
              <Text className="left_side">日期</Text>
              <Text className="center_side">净值</Text>
              <Text className="right_side">日涨幅</Text>
            </View>
          </View>
          {navList.map(
            (
              item: { nav: number; inc_ratio: number; date: string },
              index: number
            ) => {
              return (
                <View className="profit_list">
                  <View className="list_wrap">
                    <Text className="left_side">{item.date}</Text>
                    <Text className="center_side">{item.nav}</Text>
                    <Text
                      className="right_side"
                      style={{
                        color: decorationColor(item.inc_ratio * 100 + `%`),
                      }}
                    >
                      {(item.inc_ratio * 100).toFixed(2) + `%`}
                    </Text>
                  </View>
                </View>
              );
            }
          )}
        </View>
      )}
    </>
  );
};
export default HistoryNav;
