/*
 * @Date: 2023/3/10 19:39
 * @Author: yanruifeng
 * @Description: 取消解锁引导弹窗
 */

import { Image, Text, View } from "@tarojs/components";
import { level_color } from "@/config/variables";
import { decorationColor } from "@/utils/common";
import React from "react";
import { TFundItem } from "@/pages/buy-sell-signal/type";
type TProps = {
  item: TFundItem;
  fundType: string;
  hasBuyCombo: boolean;
  close: () => void;
};
const FundListItem = ({ item, fundType, hasBuyCombo, close }: TProps) => {
  return (
    <View className="fix_pos">
      <View
        className="gesture_wrap"
        style={{
          top: 260,
        }}
      >
        <View className="gesture_column">
          <Image
            src={require("@/assets/images/gesture_guide.png")}
            className="gesture_img"
          />
          <View className="gesture_center">
            <Text>您可以通过取消解锁来释放额度</Text>
          </View>
          <View className="btn_wrap" onClick={close}>
            知道了
          </View>
        </View>
      </View>
      <View
        className="fund_list"
        style={{
          top: 210,
        }}
      >
        <View className="content_wrap">
          <View className="left">
            <Text className="fund_name">{item?.fund_name}</Text>
            <Text className="fund_code">{item?.fund_code}</Text>
          </View>
          <View className="center">
            {fundType !== "unlock" ? (
              hasBuyCombo ? (
                <Text
                  className="title"
                  style={{
                    color:
                      item?.is_lock && item?.daily_level != 0
                        ? "#0051CC"
                        : level_color[item?.daily_level || 0].color,
                  }}
                >
                  {item?.is_lock && item?.daily_level != 0
                    ? "点击查看"
                    : level_color[item?.daily_level]?.text}
                </Text>
              ) : (
                <Text
                  className="title"
                  style={{
                    color: decorationColor(item?.history_percent),
                  }}
                >
                  {item?.history_percent}
                </Text>
              )
            ) : (
              <Text
                className="title"
                style={{
                  color:
                    item?.is_lock && item?.daily_level != 0
                      ? "#0051CC"
                      : level_color[item?.daily_level || 0].color,
                }}
              >
                {item?.is_lock && item?.daily_level != 0
                  ? "点击查看"
                  : level_color[item?.daily_level]?.text}
              </Text>
            )}
          </View>
          {fundType !== "unlock" ? (
            <View className="right">
              <Text
                className="title"
                style={{
                  color: hasBuyCombo
                    ? "#121D3A"
                    : decorationColor(item?.over_percent),
                }}
              >
                {hasBuyCombo ? item?.nav : item?.over_percent}
              </Text>
            </View>
          ) : (
            <View className="right">
              <View className="status_btn">
                <Text>{item?.status == 0 ? "取消解锁" : "点击解锁"}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
export default FundListItem;
