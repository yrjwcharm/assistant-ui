import React, { FC, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";

import "./index.less";

import { AtIcon } from "taro-ui";

import triangle from "@/packageActivity/assets/images/icon/triangle.png";
import RankingList from "@/packageActivity/components/RankingList";
import Taro from "@tarojs/taro";

interface IProps {
  info: PreMatchListCardType;
  activity_id: string | number;
}

const RankingCard: FC<IProps> = ({ info, activity_id }) => {
  useEffect(() => {}, []);
  return (
    <View className="ranking-card">
      <View className="top-title">
        <View className="title-active-info">
          <Text className="active-id">{info?.title}</Text>
          <Text className="active-status">{info?.status_name}</Text>
          <View className="active-triangle">
            <Image src={triangle} />
          </View>
        </View>
        {info?.activity_time_info?.time_info ? (
          <View className="active-end-time">
            <Text>
              {info?.activity_time_info?.time_name}：
              {info?.activity_time_info?.time_info}
            </Text>
          </View>
        ) : null}
      </View>
      {info?.my_schedule &&
      ((info?.my_schedule?.list && info?.my_schedule?.list?.length > 0) ||
        info?.my_schedule.me) ? (
        <RankingList list={info?.my_schedule} />
      ) : null}
      <View
        className="more-container"
        onClick={() => {
          Taro.navigateTo({
            url: `/packageActivity/pages/match-ranking-list/index?activity_id=${activity_id}&schedule_id=${info.schedule_id}`,
          });
        }}
      >
        查看当前排名
        <AtIcon value="chevron-right" size="16" color="#545968"></AtIcon>
      </View>
    </View>
  );
};

export default React.memo(RankingCard);
