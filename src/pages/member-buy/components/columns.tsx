/*
 * @Date: 2023-01-31 20:10:49
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-02 14:55:18
 * @FilePath: /assistant-ui/src/pages/member-buy/components/columns.tsx
 * @Description:
 */
import { View, Text } from "@tarojs/components";
import React from "react";
import "./index.less";

export interface TableDataType {
  combo_id: number;
  combo_name: string; // 套餐名称
  start_date: string; // 购买时间
  useful_days: number; //有效期
  expire_date: string; // 到期时间
  fund_days: number; // 信号时长
  all_nums: number; // 可解锁基金
  can_unlock_nums: number; // 剩余可解锁基金
}

export interface ColumnsType {
  title: string;
  dataIndex: string;
  width?: number; // 默认200rpx
  align?: "left" | "center" | "right"; // 默认center
  render?: (value: any, record: any) => JSX.Element; // value: 当前值 record: 当前一条数据
  renderItem?: (value: any) => JSX.Element; // value: 当前表头数据
  sorter?: boolean; // 是否排序: 默认没有排序
  ext?: string | JSX.Element;
}

const renderHeader = (value: { title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
  return (
    <View className="app-flex-column-center table-combo-header">
      <View className="table-combo-title">{value.title}</View>
    </View>
  );
};

const renderCell = (value: number | string, record: TableDataType) => {
  return (
    <View className="table-combb-cell">
      <Text>{value}</Text>
    </View>
  );
};

const formatday = (v: undefined) => (v === undefined ? "" : `${v}天`);
export const getColumns = (type: 0 | 1) => {
  const columns: ColumnsType[] = [
    {
      title: `套餐名称`,
      dataIndex: "combo_name",
    },
    {
      title: `购买时间`,
      dataIndex: "start_date",
    },
    {
      title: `套餐有效期`,
      dataIndex: "useful_days",
      render: (v, r) => renderCell(formatday(v), r),
    },
    {
      title: `到期时间`,
      dataIndex: "expire_date",
    },
    {
      title: `信号时长`,
      dataIndex: "fund_days",
      render: (v, r) => renderCell(formatday(v), r),
    },
    {
      title: `可解锁基金`,
      dataIndex: "all_nums",
    },
  ];
  if (type == 0) {
    columns.push({
      title: `剩余可解锁基金`,
      dataIndex: "can_unlock_nums",
    });
  }
  return columns.map((it) => ({
    render: renderCell,
    renderItem: renderHeader,
    ...it,
  }));
};
