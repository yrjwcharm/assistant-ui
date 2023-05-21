import React, { FC, useEffect } from "react";
import { View, Text } from "@tarojs/components";

import "./index.less";

import { AtIcon } from "taro-ui";
import Taro from "@tarojs/taro";

interface IProps {
  info: {
    name: string;
    page?: string;
  };
}

const ListCard: FC<IProps> = ({ info }) => {
  useEffect(() => {}, []);

  return (
    <View
      className="activity-list-card"
      onClick={() => {
        if (info.page) {
          Taro.navigateTo({
            url: info.page
          });
        }
      }}
    >
      <Text>{info.name}</Text>
      {info.page ? (
        <AtIcon value="chevron-right" size="16" color="#121D3A"></AtIcon>
      ) : null}
    </View>
  );
};

export default React.memo(ListCard);
