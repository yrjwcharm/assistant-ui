import React, { FC, useEffect, useState } from "react";
import { ScrollView, View } from "@tarojs/components";

import "./index.less";
import Taro, { useDidShow, useRouter, useShareAppMessage } from "@tarojs/taro";
import { defaultshareInfo } from "@/config/variables";
import PreMatchListCard from "@/packageActivity/components/PreMatchListCard";
import DefaultGraph from "@/components/DefaultGraph";
import { beforeSchedule } from "./services";
import { sendPoint } from "@/utils/sendPoint";

const pageid: string = "PKfinishedgame";
let ts_in: number = 0;

const MatchList: FC = () => {
  //activity_id: 活动id
  const { params } = useRouter();

  const [empty, setEmpty] = useState<boolean>(false); // 数据是否为空
  const [list, setList] = useState<PreMatchListCardType[]>([]); // 数据是否为空

  const init = async () => {
    Taro.showLoading();
    try {
      const res = await beforeSchedule({
        activity_id: params.activity_id!
      });
      setList(res?.list || []);

      if (!res?.list || res?.list?.length === 0) {
        setEmpty(true);
      }
    } catch (error) {}
    Taro.hideLoading();
  };

  useDidShow(() => {
    ts_in = Date.now();
    sendPoint({
      pageid: pageid,
      ts: ts_in,
      event: "load"
    });
    init();
  });

  useEffect(() => {}, []);

  useShareAppMessage(res => {
    return defaultshareInfo();
  });

  return (
    <ScrollView scrollY className="activity-match-list">
      {empty ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <DefaultGraph title="暂无数据" />
        </View>
      ) : null}
      {!empty && list?.length > 0 ? (
        <View className="list-container">
          {list.map(item => {
            return (
              <View>
                <PreMatchListCard
                  activity_id={params.activity_id!}
                  info={item}
                />
              </View>
            );
          })}
        </View>
      ) : null}
    </ScrollView>
  );
};

export default MatchList;
