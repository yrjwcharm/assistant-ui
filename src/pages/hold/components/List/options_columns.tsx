import { View, Text } from "@tarojs/components";
import React from "react";
import { ColumnsType } from "@/components/Table";

import getValueColor from "@/utils/getValueColor";
import { level_color } from "@/config/variables";
export const columns = (titleDate: any = {}) => {
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
  //   daily_estimate: "02-17"
  // daily_inc: "02-17"
  // daily_level: "02-17"
  // day_profit: "02-17"
  // month_estimate: "02-17"
  // owned_amount: "02-17"
  // private_share: "02-17"
  // profit: "02-17"
  // ratio: "02-17"
  // valuation_cur_gain_date: "02-20"
  // valuation_cur_profit_date: "02-20"
  // valuation_nav_date: "02-20"
  return [
    {
      title: `基金名称`,
      dataIndex: "fund_code",
      width: 300,
      align: "left",
      render: (value, record) => {
        return (
          <View className="table-fund-name-C">
            <Text className="table-fund-name table-fund-name-active">
              {record.fund_name ?? "--"}
            </Text>
            <View
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Text className="table-fund-hold">{value ?? "--"}</Text>
            </View>
          </View>
        );
      },
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
      title: "最新净值",
      dataIndex: "nav",
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
      title: "关注以来",
      dataIndex: "follow_later",
      width: 180,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View>
              <View
                className="table-fund-data-val"
                style={{
                  color: getValueColor(`${_record?.follow_later ?? "--"}`),
                }}
              >
                {_record?.follow_later ?? "--"}
              </View>
              {_record?.follow_later_date ? (
                <View className="table-fund-data-time">
                  {_record?.follow_later_date}
                </View>
              ) : null}
            </View>
          </View>
        );
      },
    },
    {
      title: "近一周",
      dataIndex: "week",
      width: 180,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View
              className="table-fund-data-val"
              style={{
                color: getValueColor(`${_record?.week ?? "--"}`),
              }}
            >
              {_record?.week ?? "--"}
            </View>
          </View>
        );
      },
    },
    {
      title: "近一月",
      dataIndex: "month",
      width: 180,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View
              className="table-fund-data-val"
              style={{
                color: getValueColor(`${_record?.month ?? "--"}`),
              }}
            >
              {_record?.month ?? "--"}
            </View>
          </View>
        );
      },
    },
    {
      title: "今年以来",
      dataIndex: "year",
      width: 180,
      renderItem: renderItem,
      render: (value, _record) => {
        return (
          <View className="table-fund-data">
            <View
              className="table-fund-data-val"
              style={{
                color: getValueColor(`${_record?.year ?? "--"}`),
              }}
            >
              {_record?.year ?? "--"}
            </View>
          </View>
        );
      },
    },
  ] as ColumnsType[];
};

export default columns;
