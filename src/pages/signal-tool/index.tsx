import React, { FC, useEffect, useState } from "react";
import { ScrollView, View, Image } from "@tarojs/components";

import "./index.less";
import Taro, { useRouter, useShareAppMessage } from "@tarojs/taro";
import { getContent } from "./services";
import { defaultshareInfo } from "@/config/variables";
import { sendPoint } from "@/utils/sendPoint";

const pageid: string = "Undertools";
let ts_in: number = 0;

const SignalTool: FC = () => {
  const { params } = useRouter();

  const [imagesList, setImagesList] = useState<string[]>([]);

  const init = async () => {
    try {
      const res = await getContent({
        rights_id: params.rights_id || "lowBuySignal"
      });
      setImagesList(res.img || []);
    } catch (error) {}
    Taro.hideLoading();
  };

  useEffect(() => {
    Taro.showLoading({
      title: "加载中..."
    });
    init();
  }, []);

  useShareAppMessage(res => {
    return defaultshareInfo();
  });

  useEffect(() => {
    ts_in = Date.now();
    sendPoint({
      pageid: pageid,
      ts: ts_in,
      event: "load"
    });

    return () => {
      sendPoint({
        pageid: pageid,
        ts: Date.now(),
        event: "load",
        staytime: Date.now() - ts_in
      });
    };
  }, []);

  return (
    <ScrollView scrollY className="signal-tool-c">
      <View
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F8 100%)",
          minHeight: "100%",
        }}
      >
        {/*<View*/}
        {/*  style={{*/}
        {/*    padding: "40rpx 36rpx"*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <UserInfo />*/}
        {/*</View>*/}
        <View>
          {imagesList?.map(item => {
            return (
              <Image
                src={item}
                mode="widthFix"
                style={{
                  width: "100%",
                  marginBottom: "30rpx"
                }}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default SignalTool;
