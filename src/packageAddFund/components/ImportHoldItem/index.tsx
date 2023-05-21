import { View, Text } from "@tarojs/components";
import React, { FC } from "react";

import "./index.less";
import Taro from "@tarojs/taro";
import { AtIcon } from "taro-ui";
import getValueColor from "@/utils/getValueColor";

interface IProps {
  data: {
    fund_code: string;
    fund_name: string;
    owned_amount?: string;
    profit?: string;
  };
  index: number;
}

const ImportHoldItem: FC<IProps> = ({ data, index }) => {
  return (
    <View className="import-item-container">
      <View className="fund-info">
        <Text className="fund-name">{data.fund_name}</Text>
        <Text className="fund-code">{data.fund_code}</Text>
      </View>
      <View className="hold-info">
        <View className="info-container">
          <View className="key">持有金额</View>
          <View className="value">{data.owned_amount}</View>
        </View>
        <View className="info-container">
          <View className="key">持有收益</View>
          <View
            className="value"
            style={{
              color: getValueColor(`${data.profit}` || ""),
            }}
          >
            {data.profit}
          </View>
        </View>
      </View>
      <View
        className="edit-container"
        onClick={() => {
          Taro.navigateTo({
            url: `/packageAddFund/pages/edit-fund/index?index=${index}&goBack=1`,
          });
        }}
      >
        <Text>编辑</Text>
        <AtIcon value="chevron-right" size="14" color="#0051CC"></AtIcon>
      </View>
    </View>
  );
};

export default ImportHoldItem;
