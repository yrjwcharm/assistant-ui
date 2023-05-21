import React, { FC } from "react";
import { View, Text, Image } from "@tarojs/components";

import "./index.less";
import { sortIcon } from "@/packageActivity/config/variables";
import getValueColor from "@/utils/getValueColor";

interface IProps {
  list: MyScheduleType;
}

const RankingList: FC<IProps> = ({ list }) => {
  return (
    <View className="ranking-list-table">
      <View className="table-head">
        <View className="head first">当前排名</View>
        <View className="head second">累计收益率</View>
      </View>
      {(list.list && list.list?.length > 0) || list.me ? (
        <View className="table-body">
          {list.me ? (
            <View className="list active">
              <View className="first">
                {list.me.mysort ? (
                  <View className="sort-view">{list.me.mysort}</View>
                ) : null}
                <Text className="nick-name">{list.me.mobile}</Text>
              </View>
              <View
                className="second"
                style={{
                  color: getValueColor(`${list.me.score}`)
                }}
              >
                {list.me.score}%
              </View>
            </View>
          ) : null}
          {list.list && list.list?.length > 0 ? (
            <>
              {list.list.map((item, index) => {
                return (
                  <View className="list">
                    <View className="first">
                      {sortIcon[index + 1] ? (
                        <Image
                          className="sort-icon"
                          src={sortIcon[index + 1]}
                        />
                      ) : (
                        <View className="sort-view">{index + 1}</View>
                      )}

                      <Text className="nick-name">{item.mobile}</Text>
                    </View>
                    <View
                      className="second"
                      style={{
                        color: getValueColor(`${item.score}`)
                      }}
                    >
                      {item.score}%
                    </View>
                  </View>
                );
              })}
            </>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

export default RankingList;
