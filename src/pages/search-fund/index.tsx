import { Image, Input, Text, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import "./index.less";
import { callSearchFundNewApi } from "@/pages/search-fund/services";
import { TFundItem } from "@/pages/search-fund/type";
import Taro from "@tarojs/taro";
import { toSignalDetails } from "@/pages/reminder-list/toSignalDetails";
import { decorationColor } from "@/utils/common";
const SearchFund = () => {
  const isIphoneX = Taro.getStorageSync("isIphoneX");
  const [keywords, setkeywords] = useState<string>("");
  const [fundList, setFundList] = useState<TFundItem[]>([]);
  useEffect(() => {
    if (!keywords) return;
    initData();
  }, [keywords]);
  const initData = async () => {
    const res = await callSearchFundNewApi({
      words: keywords,
    });
    Object.keys(res.list ?? []).length == 0 &&
      Taro.showToast({
        title: "您搜索的基金暂不支持买卖信号",
        icon: "none",
        mask: true,
      });
    setFundList(res.list ?? []);
  };
  const jumpToBuySellSignalDetail = (item: { fund_code: string }) => {
    toSignalDetails(item.fund_code);
  };
  return (
    <View
      className="search_fund_box"
      style={{
        paddingBottom: isIphoneX ? "17PX" : 0,
      }}
    >
      <View className="search_fund_box_search_wrap">
        <View className="search">
          <Image
            src={require("@assets/images/search.png")}
            className="search_icon"
          />
          <Input
            className="input"
            onInput={(e) => {
              setkeywords(e.detail.value);
            }}
            placeholder="搜基金代码/名称"
            placeholderClass="placeholderClass"
          />
        </View>
        <Text className="search_text">搜索</Text>
      </View>
      {fundList?.map((el, index) => {
        return (
          <View className="search_fund_box_list">
            <View className="list_wrap">
              <View className="left">
                <View className="top_wrap">
                  <Text className="fund_name">{el.fund_name}</Text>
                  <Text className="fund_code">{el.fund_code}</Text>
                </View>
                <View className="center">
                  <Text
                    style={{
                      color: decorationColor(el.profit_rate),
                    }}
                  >
                    {el.profit_rate}
                  </Text>
                </View>
                <View className="bottom_title">
                  <Text>{el.tip}</Text>
                </View>
              </View>
              <View className="right_wrap">
                <View
                  className="right"
                  onClick={() => jumpToBuySellSignalDetail(el)}
                >
                  <Text>查看买卖信号</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};
export default SearchFund;
