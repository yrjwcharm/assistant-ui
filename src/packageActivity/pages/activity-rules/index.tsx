import React, { FC, useEffect, useState } from "react";
import { ScrollView, View, Image } from "@tarojs/components";

import "./index.less";
import Taro, { useDidShow, useRouter, useShareAppMessage } from "@tarojs/taro";
import { defaultshareInfo } from "@/config/variables";
import DefaultGraph from "@/components/DefaultGraph";
import { ruleImages } from "./services";
import { sendPoint } from "@/utils/sendPoint";

const pageid: string = "PKrule";
let ts_in: number = 0;

const ActivityRules: FC = () => {
  const [empty, setEmpty] = useState<boolean>(false); // 数据是否为空
  const [list, setList] = useState<string[]>([]); // 页面图片

  const { params } = useRouter();

  const init = async () => {
    Taro.showLoading();
    try {
      const res = await ruleImages({
        activity_id: params.activity_id!,
      });
      setList(res?.img || []);

      if (!res?.img || res?.img?.length === 0) {
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
      event: "load",
    });
    init();
  });

  useEffect(() => {}, []);

  useShareAppMessage((res) => {
    return defaultshareInfo();
  });

  return (
    <ScrollView scrollY className="activity-rules">
      {empty ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DefaultGraph title="暂无数据" />
        </View>
      ) : null}
      {!empty && list?.length > 0 ? (
        <View className="list-container">
          {list.map((item) => {
            return (
              <Image
                src={item}
                mode="widthFix"
                style={{
                  width: "100%",
                }}
              />
            );
          })}
        </View>
      ) : null}
    </ScrollView>
  );
};

export default ActivityRules;
