import { View, Text } from "@tarojs/components";
import React from "react";
import { ColumnsType } from "@/components/Table";

import getValueColor from "@/utils/getValueColor";
import { level_color } from "@/config/variables";
export const columns = (titleDate: any = {}) => {
  console.log("titleDate", titleDate);
  const renderItem = (value: {
    title:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | React.ReactFragment
      | React.ReactPortal
      | null
      | undefined;
    dataIndex: string | number;
  }) => {
    return (
      <View className="app-flex-column-center">
        <View className="thead-title">{value.title}</View>
        {titleDate && titleDate[value.dataIndex] ? (
          <View className="thead-time">{titleDate[value.dataIndex]}</View>
        ) : (
          <View className="thead-time">--</View>
        )}
      </View>
    );
  };

  return [
    {
      title: "基金名称",
      dataIndex: "fund_code",
      width: 300,
      align: "left",
      render: (_value, record) => {
        return (
          <View className="table-fund-name-C">
            <Text className={`table-fund-name table-fund-name-active`}>
              {record.fund_name ?? "--"}
            </Text>
            <Text className="table-fund-hold">
              {`¥${record.owned_amount}` ?? "--"}
            </Text>
          </View>
        );
      },
      // width: 160
    },
    {
      title: "买卖点信号",
      dataIndex: "daily_level",
      width: 160,
      // sorter: true,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-level">
            {_record.is_lock && _record.daily_level != 0 ? (
              <View className="table-fund-level-btn">
                <Text>点击查看</Text>
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    color: level_color[value ?? 0].color,
                  }}
                >
                  {level_color[value ?? 0].text}
                </Text>
                {_record?.daily_level_date ? (
                  <View className="table-fund-data-time">
                    {_record?.daily_level_date}
                  </View>
                ) : null}
              </View>
            )}
          </View>
        );
      },
    },
    {
      title: "当日涨幅",
      dataIndex: "valuation_cur_gain_date",
      // sorter: true,
      width: 160,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View
                className="table-fund-data-val"
                style={{
                  color: getValueColor(
                    `${_record?.valuation_cur_gain ?? "--"}`
                  ),
                }}
              >
                {_record?.valuation_cur_gain ?? "--"}
              </View>
              {_record?.valuation_date ? (
                <View className="table-fund-data-time">
                  {_record?.valuation_date}
                </View>
              ) : null}
            </View>
          </View>
        );
      },
    },
    {
      title: "当日收益",
      dataIndex: "valuation_cur_profit_date",
      width: 160,
      // sorter: true,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View
                className="table-fund-data-val"
                style={{
                  color: getValueColor(
                    `${_record?.valuation_cur_profit ?? "--"}`
                  ),
                }}
              >
                {_record?.valuation_cur_profit ?? "--"}
              </View>
              {_record?.valuation_date ? (
                <View className="table-fund-data-time">
                  {_record?.valuation_date}
                </View>
              ) : null}
            </View>
          </View>
        );
      },
    },
    {
      title: "估算净值",
      dataIndex: "valuation_nav_date",
      width: 160,
      // sorter: true,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View
                className="table-fund-data-val"
                style={{
                  color: "#121d3a",
                }}
              >
                {_record?.valuation_nav ?? "--"}
              </View>
              {_record?.valuation_date ? (
                <View className="table-fund-data-time">
                  {_record?.valuation_date}
                </View>
              ) : null}
            </View>
          </View>
        );
      },
    },
    {
      title: "最新净值",
      dataIndex: "nav",
      width: 160,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View
                className="table-fund-data-val"
                style={{
                  color: "#121d3a",
                }}
              >
                {_record?.nav ?? "--"}
              </View>
              {_record?.nav_date ? (
                <View className="table-fund-data-time">
                  {_record?.nav_date}
                </View>
              ) : null}
            </View>
          </View>
        );
      },
    },
    {
      title: "昨日涨幅",
      dataIndex: "daily_inc",
      // sorter: true,
      width: 160,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View
                className="table-fund-data-val"
                style={{
                  color: getValueColor(`${_record?.daily_inc ?? "--"}`),
                }}
              >
                {_record?.daily_inc ?? "--"}
              </View>
              {_record?.daily_inc_date ? (
                <View className="table-fund-data-time">
                  {_record?.daily_inc_date}
                </View>
              ) : null}
            </View>
          </View>
        );
      },
    },
    {
      title: "昨日收益",
      dataIndex: "day_profit",
      width: 160,
      // sorter: true,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View
                className="table-fund-data-val"
                style={{
                  color: getValueColor(`${_record?.day_profit ?? "--"}`),
                }}
              >
                {_record?.day_profit ?? "--"}
              </View>
              {_record?.day_profit_date ? (
                <View className="table-fund-data-time">
                  {_record?.day_profit_date}
                </View>
              ) : null}
            </View>
          </View>
        );
      },
    },
    {
      title: "持有收益",
      dataIndex: "profit",
      width: 160,
      // sorter: true,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View
                className="table-fund-data-val"
                style={{
                  color: getValueColor(`${_record?.profit ?? "--"}`),
                }}
              >
                {_record?.profit ?? "--"}
              </View>
              {_record?.profit_date ? (
                <View className="table-fund-data-time">
                  {_record?.profit_date}
                </View>
              ) : null}
            </View>
          </View>
        );
      },
    },
    {
      title: "持有金额",
      dataIndex: "owned_amount",
      width: 160,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View className="table-fund-data-val">
                {_record?.owned_amount ?? "--"}
              </View>
              {_record?.owned_amount_date ? (
                <View className="table-fund-data-time">
                  {_record?.owned_amount_date}
                </View>
              ) : null}
            </View>
          </View>
        );
      },
    },
    {
      title: "持仓占比",
      dataIndex: "ratio",
      width: 180,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View className="table-fund-data-val">
                {_record?.ratio ?? "--"}
              </View>
            </View>
          </View>
        );
      },
    },
    {
      title: "持有份额",
      dataIndex: "private_share",
      width: 200,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View className="table-fund-data-val">
                {_record?.private_share ?? "--"}
              </View>
            </View>
          </View>
        );
      },
    },
  ] as ColumnsType[];
};

export default columns;
