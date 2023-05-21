import React, { FC } from "react";
import { View } from "@tarojs/components";

import "./index.less";
import RankingList from "../RankingList";
import Taro from "@tarojs/taro";

interface IProps {
  info: PreMatchListCardType;
  activity_id: string | number;
}

const PreMatchListCard: FC<IProps> = ({ info, activity_id }) => {
  return (
    <View className="pre-match-list-card">
      <View className="top-container">
        <View
          style={{
            borderBottom:
              info?.my_schedule &&
              ((info?.my_schedule?.list &&
                info?.my_schedule?.list?.length > 0) ||
                info?.my_schedule.me)
                ? "2rpx solid #E9EAEF"
                : "0",
          }}
        >
          <View className="match-info">
            <View className="title">{info?.title || ""}</View>
            <View className="pk-time">
              {`${info?.activity_time_info.time_name}：${info?.activity_time_info.time_info}` ||
                ""}
            </View>
          </View>
          <View
            className="name-list-btn"
            onClick={() => {
              Taro.navigateTo({
                url: `/packageActivity/pages/match-ranking-list/index?activity_id=${activity_id}&schedule_id=${info.schedule_id}`,
              });
            }}
          >
            获奖名单
          </View>
        </View>
      </View>
      {info?.my_schedule &&
      ((info?.my_schedule?.list && info?.my_schedule?.list?.length > 0) ||
        info?.my_schedule.me) ? (
        <View className="bottom-container">
          <RankingList list={info?.my_schedule} />
        </View>
      ) : null}
    </View>
  );
};

export default PreMatchListCard;
