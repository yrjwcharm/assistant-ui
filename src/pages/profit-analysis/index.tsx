import "./index.less";
import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { callProfitAnalysisList } from "@/pages/profit-analysis/services";
import Taro from "@tarojs/taro";
import { decorationColor } from "@/utils/common";
const ProfitAnalysis = () => {
  const [sum_profit, setSubProfit] = useState<string>("");
  const [hold_profit, setHoldProfit] = useState<string>("");
  const [array, setArray] = useState([]);
  /**
   * 获取收益明细列表
   */
  useEffect(() => {
    const {
      fund_code,
      period = "all",
      fund_name = "",
    } = Taro.getCurrentInstance().router?.params ?? {
      fund_code: "",
      period: "",
    };
    Taro.setNavigationBarTitle({ title: fund_name });
    async function getProfitMxList() {
      const res = await callProfitAnalysisList({
        fund_code: fund_code!,
        period: period!,
      });
      const { sum_profit = "", hold_profit = "", chart = [] } = res.chart_list;
      setSubProfit(sum_profit);
      setHoldProfit(hold_profit);
      let maxObj = chart?.reduce(
        (x: { profit: string | number }, y: { profit: string | number }) =>
          Math.abs(+x.profit) > Math.abs(+y.profit) ? x : y
      );
      let list = chart.map((item: { profit: string | number }) => {
        return {
          width: Math.abs((+item.profit / +maxObj.profit) * 343),
          ...item,
        };
      });
      setArray(list);
    }
    getProfitMxList().then((r) => {});
  }, []);
  return (
    <View className="profit_mx_box">
      <View className="profit_mx_header">
        <View className="left_side">
          <Text className="label">持有收益(元)</Text>
          <Text
            className="label"
            style={{
              color: decorationColor(hold_profit),
            }}
          >
            {hold_profit}
          </Text>
        </View>
        <View className="center_side" />
        <View className="right_side">
          <Text className="label">累计收益(元)</Text>
          <Text
            className="value"
            style={{
              color: decorationColor(sum_profit),
            }}
          >
            {sum_profit}
          </Text>
        </View>
      </View>
      {array.map(
        (
          item: {
            width: number;
            profit: string;
            ra_date: string;
            ra_nav: string;
          },
          index
        ) => {
          return (
            <View
              className="profit_analysis_list_row"
              style={{ background: "#E9EAEF" }}
            >
              <View
                className="row_item"
                style={{
                  width: item.width,
                  background:
                    +item.profit > 0
                      ? "#E74949"
                      : +item.profit < 0
                      ? "#4ba471"
                      : "#121b3a",
                }}
              >
                <Text className="date">{item.ra_date}</Text>
                <Text className="value">{item.profit}</Text>
              </View>
            </View>
          );
        }
      )}
    </View>
  );
};
export default ProfitAnalysis;
