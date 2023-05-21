/*
 * @Date: 2023/3/13 14:31
 * @Author: yanruifeng
 * @Description:
 */

import { Image, ITouchEvent, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { TFundItem, THead, TNavItem } from "@/pages/buy-sell-signal/type";
import { level_color } from "@/config/variables";
import { decorationColor } from "@/utils/common";
import React from "react";
import { useStoreState } from "@/hooks";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
type TProps = {
  navList: TNavItem[];
  onNavClick: (item: TNavItem, index: number) => void;
  hasBuyCombo: boolean;
  left: THead;
  right: THead;
  center: THead;
  fundList: TFundItem[];
  isEmpty: boolean;
  id: string;
  activeIndex: number;
  toBuySellSignalDetail: (item: TFundItem, index: number) => void;
  updateFundStatus: (e: ITouchEvent, item: TFundItem) => void;
  expireTxt: string;
  expireTxtColor: string;
};
const MyFundList = ({
  navList,
  onNavClick,
  hasBuyCombo,
  left,
  right,
  center,
  fundList,
  isEmpty,
  id,
  activeIndex,
  toBuySellSignalDetail,
  updateFundStatus,
  expireTxt,
  expireTxtColor,
}: TProps) => {
  const {
    global: { userType, fundType },
  } = useStoreState();
  const [renderPhoneAuthButton] = usePhoneAuthorization();
  return (
    <View
      id={id}
      className="buy_sell_box_content_my_fund"
      style={{
        paddingLeft: userType !== "2" ? 0 : "16PX",
        paddingRight: userType !== "2" ? 0 : "16PX",
        minHeight: "380PX",
        position: "relative",
      }}
    >
      {userType !== "2" ? (
        <View className="mask">
          <Image
            className="fund_img"
            mode="widthFix"
            src="https://static.licaimofang.com/wp-content/uploads/2023/03/fund_lock.png"
          />
          {userType !== "2" ? renderPhoneAuthButton() : null}
        </View>
      ) : (
        <>
          <View className="buy_sell_box_content_my_fund_header">
            <View className="header_wrap">
              <View className="left_side">
                <View className="separator" />
                <Text className="title">我的基金</Text>
                <Image
                  src={require("@/assets/images/buy-sell-signal/add.png")}
                  className="add"
                />
                <Text className="sub_title">买卖信号</Text>
              </View>
              <Text className="issue_date" style={{ color: expireTxtColor }}>
                {expireTxt}
              </Text>
            </View>
          </View>
          <View className="nav_wrap">
            {navList.map((item, index: 0 | 1 | 2) => {
              return (
                <View
                  key={index}
                  onClick={() => onNavClick(item, index)}
                  style={{
                    marginRight: index == navList.length - 1 ? 0 : "7PX",
                    flex: index == navList.length - 1 ? 1.5 : 1,
                    color: item.isActive ? "#0051CC" : "#121D3A",
                    background: item.isActive ? "#DEE8FF" : "#f5f6f8",
                    fontWeight: item.isActive ? 500 : 400,
                    fontFamily: item.isActive
                      ? "PingFangSC-Medium"
                      : "PingFangSC-Regular",
                  }}
                  className="nav_btn"
                >
                  <Text>{`${item.tab_name}(${item.count})`}</Text>
                </View>
              );
            })}
          </View>
          <View className="my_fund_content">
            <View className="header_content" id="nav_wrap">
              <View className="header_wrap">
                <Text className="fund_name">{left?.title}</Text>
                <View className="center">
                  <View className="center_wrap">
                    <Text className="title">{center?.title}</Text>
                    {activeIndex != 2 && !hasBuyCombo && (
                      <Image
                        src={require("@assets/images/ask_symbol.png")}
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
                  {center?.date && <Text className="date">{center?.date}</Text>}
                </View>
                <View className="right">
                  <Text className="title">{right?.title}</Text>
                  {right?.date && <Text className="date">{right?.date}</Text>}
                </View>
              </View>
            </View>
            {!isEmpty ? (
              fundList?.map((item: TFundItem, index) => {
                return (
                  <View
                    className="my_fund_content_content_list"
                    onClick={() => toBuySellSignalDetail(item, index)}
                  >
                    <View className="left">
                      <Text className="fund_name">{item.fund_name}</Text>
                      <Text className="fund_code">{item.fund_code}</Text>
                    </View>
                    <View className="center">
                      {fundType !== "unlock" ? (
                        hasBuyCombo ? (
                          <Text
                            className="title"
                            style={{
                              color:
                                item.is_lock && item.daily_level != 0
                                  ? "#0051CC"
                                  : level_color[item.daily_level || 0].color,
                            }}
                          >
                            {item.is_lock && item.daily_level != 0
                              ? "点击查看"
                              : level_color[item.daily_level]?.text}
                          </Text>
                        ) : (
                          <Text
                            className="title"
                            style={{
                              color: decorationColor(item.history_percent),
                            }}
                          >
                            {item.history_percent}
                          </Text>
                        )
                      ) : (
                        <Text
                          className="title"
                          style={{
                            color:
                              item.is_lock && item.daily_level != 0
                                ? "#0051CC"
                                : level_color[item.daily_level || 0].color,
                          }}
                        >
                          {item.is_lock && item.daily_level != 0
                            ? "点击查看"
                            : level_color[item.daily_level]?.text}
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
                              : decorationColor(item.over_percent),
                          }}
                        >
                          {hasBuyCombo ? item.nav : item.over_percent}
                        </Text>
                      </View>
                    ) : (
                      <View className="right">
                        <View
                          className="status_btn"
                          onClick={(e) => updateFundStatus(e, item)}
                        >
                          <Text>
                            {item.status == 0 ? "取消解锁" : "点击解锁"}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <View className="empty_tip">
                <Image
                  className="icon"
                  src={require("@/assets/images/default-graph/no-data.png")}
                />
                <Text className="empty_text">暂无数据</Text>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};
export default MyFundList;
