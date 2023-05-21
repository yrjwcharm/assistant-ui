import { View, Image } from "@tarojs/components";
import React, { FC, useEffect } from "react";

import "./index.less";
import { useDidShow } from "@tarojs/taro";

import selected from "@/assets/images/icons/selected.png";
import noSelected from "@/assets/images/icons/no-selected.png";

interface IProps {
  data: {
    fund_name: string; //基金名称
    fund_code: string;
    select: boolean;
  };
  index: number;
  onChangeSelect: (index: number, select: boolean) => any;
}

const ImportItem: FC<IProps> = ({ data, index, onChangeSelect }) => {
  useDidShow(() => {});
  useEffect(() => {}, []);

  return (
    <View
      className="import-item-container"
      onClick={() => {
        onChangeSelect && onChangeSelect(index, !data.select);
      }}
    >
      <View className="item-icon">
        <Image src={data.select ? selected : noSelected} />
      </View>
      <View
        style={{
          flex: 1,
          marginLeft: "16rpx"
        }}
      >
        <View className="fund-name">{data.fund_name}</View>
        <View className="fund-code">{data.fund_code}</View>
      </View>
    </View>
  );
};

export default ImportItem;
