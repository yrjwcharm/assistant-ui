import { View, Text, Image } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import "./index.less";
import { THead } from "./type";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { callRankListApi } from "@/pages/excess-profit-list/services";
import dayjs from "dayjs";
import { TProductHead, TProductItem } from "@/pages/buy-sell-signal/type";
import { decorationColor } from "@/utils/common";
import { sendPoint } from "@/utils/sendPoint";
import { h5BaseURL } from "@/config";
import { getStorage } from "@/utils/local";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { defaultshareInfo } from "@/config/variables";
import LoadingTip from "@/components/Loading/Loading";
const ExcessProfitList = () => {
  const isIphoneX = Taro.getStorageSync("isIphoneX");
  const [loading, setLoading] = useState<boolean>(true);
  const [head, setHead] = useState<THead>({
    desc: "",
    title: "",
    updated_at: "",
  });
  const [[leftSide, centerSide, rightSide], setProductHead] = useState<
    TProductHead[]
  >([]);
  const [productList, setProductList] = useState<TProductItem[]>();
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  useEffect(() => {
    const { index } = Taro.getCurrentInstance().router?.params ?? { index: 0 };
    sendPoint({
      pageid:
        index == 0
          ? "purchaselist"
          : index == 1
          ? "risinglist"
          : index == 2
          ? "startlist"
          : index == 3
          ? "platelist"
          : "excesslist",
      ts: Date.now(),
      event: "load",
    });
  }, []);
  // @ts-ignore
  useShareAppMessage(async (_res) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/buy-sell-signal/index" + path);
  });

  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/buy-sell-signal/index" + path);
  });
  useDidShow(() => {
    (async () => {
      try {
        const { subject_id } = Taro.getCurrentInstance().router?.params ?? {};
        const res = await callRankListApi({ subject_id: subject_id ?? "" });
        const { th = [], items = [] } = res?.body?.products ?? {};
        Taro.setNavigationBarTitle({
          title: res?.header?.title ?? "",
        });
        items.length > 0 ? setIsEmpty(false) : setIsEmpty(true);
        setProductList(items);
        setProductHead(th);
        setHead(res?.header ?? {});
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setIsEmpty(true);
      }
    })();
  });
  return (
    <>
      {loading ? (
        <LoadingTip />
      ) : (
        <View
          className="excess_profit_box"
          style={{
            paddingBottom: isIphoneX ? "17PX" : 0,
          }}
        >
          {!isEmpty ? (
            <View className="recommend">
              <Text className="recommend_title">{head.desc}</Text>
              <View className="rank_update_date">
                <Text>
                  榜单更新时间：
                  {head.updated_at && dayjs(head.updated_at).format("MM-DD")}
                </Text>
              </View>
              <View className="recommend_content">
                <View className="content_header">
                  <View className="header_wrap">
                    <Text className="fund_name">{leftSide?.value}</Text>
                    <View className="history_wrap">
                      <Text className="history_profit">
                        {centerSide?.value}
                      </Text>
                      {centerSide?.explain && (
                        <Image
                          src={require("@/assets/images/ask_symbol.png")}
                          className="ask"
                          onClick={() => {
                            Taro.showModal({
                              content: "自买卖点信号首次出现后历史业绩",
                              confirmColor: "#0051CC",
                              showCancel: false,
                              confirmText: "知道了",
                            });
                          }}
                        />
                      )}
                    </View>
                    <View className="superWrap">
                      <View className="super_item">
                        <Text className="superProfit">{rightSide?.value}</Text>
                        {rightSide?.explain && (
                          <Image
                            className="ask"
                            onClick={() => {
                              Taro.showModal({
                                content: rightSide?.explain,
                                showCancel: false,
                                confirmColor: "#0051CC",
                                confirmText: "知道了",
                              });
                            }}
                            src={require("@/assets/images/ask_symbol.png")}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
                <View className="my_fund_content">
                  {productList?.map((item, index) => {
                    const [left, center, right] = item.td ?? [];
                    return (
                      <View
                        className="content_list"
                        onClick={() => {
                          const url = encodeURIComponent(
                            `${h5BaseURL}fund-assistant/signal-details?token=${getStorage(
                              "token"
                            )}&uid=${getStorage("uid")}&fund_code=${
                              left.secondary
                            }&chn=${getStorage("channel")}&did=${getStorage(
                              "did"
                            )}&is_cover=${left.is_cover ? 1 : 0}`
                          );
                          Taro.navigateTo({
                            url: `/pages/web-signal-details/index?url=${url}`,
                          });
                        }}
                      >
                        <View className="left">
                          <Text className="fund_name">{left.value}</Text>
                          <Text className="fund_code">{left.secondary}</Text>
                          {left.is_cover && (
                            <View className="mask">
                              <Text className="title">{left.cover_text}</Text>
                            </View>
                          )}
                        </View>
                        <View className="center">
                          <Text
                            className="title"
                            style={{
                              color: decorationColor(center.value),
                            }}
                          >
                            {center.value}
                          </Text>
                        </View>
                        <View className="right">
                          <Text
                            className="title"
                            style={{ color: decorationColor(right.value) }}
                          >
                            {right.value}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : (
            <View className="empty_tip">
              <View className="empty_wrap">
                <Image
                  className="icon"
                  src={require("@/assets/images/default-graph/no-data.png")}
                />
                <Text className="empty_text">暂无数据</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </>
  );
};
export default ExcessProfitList;
