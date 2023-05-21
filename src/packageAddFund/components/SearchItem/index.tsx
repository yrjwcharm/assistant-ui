import { View, Text } from "@tarojs/components";
import React, { FC, useEffect } from "react";

import "./index.less";
import { useDidShow } from "@tarojs/taro";
import getValueColor from "@/utils/getValueColor";

interface IProps {
  data: {
    fund_name: string; // 基金名称
    fund_code: string; // 基金代码
    year: string; // 近一年收益
    selected: 1 | 2; // 1代表关注,2代表未关注
  };
}

const SearchItem: FC<IProps> = ({ data }) => {
  useDidShow(() => {});
  useEffect(() => {}, []);

  return (
    <View className="search-item-container">
      <View className="content-c">
        <View>
          <Text className="fund-name">{data.fund_name}</Text>
          <Text className="fund-code">{data.fund_code}</Text>
        </View>
        <View>
          <View
            className="fund-yield"
            style={{
              color: getValueColor(`${data.year}`),
            }}
          >
            {data.year}
          </View>
          <View className="fund-key">近一年收益率</View>
        </View>
      </View>
      <View className="collection-c">
        <View className={`button ${data.selected == 1 ? "" : "active"}`}>
          <Text>{data.selected == 1 ? "已添加" : "添加"}</Text>
        </View>

        {/* <Image src={data.selected == 1 ? cancelCollection : collection} /> */}
      </View>
    </View>
  );
};

export default SearchItem;
