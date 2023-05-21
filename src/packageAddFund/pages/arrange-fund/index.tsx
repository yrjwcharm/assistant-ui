import { View, Image, Text } from "@tarojs/components";
import React, { useEffect, useState } from "react";

import Taro from "@tarojs/taro";
import {
  callDelFundListApi,
  callEditFundListApi,
} from "@/packageAddFund/pages/arrange-fund/services";
import { TFundItem } from "@/packageAddFund/pages/arrange-fund/type";
import "./index.less";
import { FixedView } from "@taroify/core";
import { screenBottom } from "@/config/layoutSize";
import LoadingTip from "@/components/Loading/Loading";
const selected = require("@/assets/images/icons/selected.png");
const noSelected = require("@/assets/images/icons/no-selected.png");
const ArrangeFund = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [fundList, setFundList] = useState<TFundItem[]>([]);
  const [allSelect, setAllSelect] = useState<boolean>(false);
  const deleteFund = () => {
    let selectFunds: { fund_code: number; type: number }[] = [];
    (fundList ?? []).map((item) => {
      item.list.map((ele, index) => {
        if (ele.isActive) {
          selectFunds.push({
            fund_code: ele.code,
            type: item.type,
          });
        }
      });
    });
    if (selectFunds.length === 0) {
      Taro.showToast({
        title: "请至少选择一支基金",
        icon: "none",
        duration: 1500,
      });
    } else {
      Taro.showModal({
        title: "确认删除？",
        success: async (res) => {
          if (res.confirm) {
            Taro.showLoading({
              title: "请稍等...",
              mask: true,
            });
            try {
              const res = await callDelFundListApi({
                fund_list: selectFunds,
              });
              if (res) {
                Taro.eventCenter.trigger("updateMyFundList");
                Taro.navigateBack();
              }
            } catch (error) {}
            Taro.hideLoading();
          }
        },
      });
    }
  };
  useEffect(() => {
    initEditFundList();
  }, []);
  /**
   * 初始化编辑列表
   */
  const initEditFundList = async () => {
    const { page_type = "" } = Taro.getCurrentInstance().router?.params ?? {};
    const res = await callEditFundListApi({
      page_type,
    });
    isAll(res, false);
    setLoading(false);
  };
  const isAll = (arr: any, isActive: boolean) => {
    let arrayList = (arr ?? []).map((item: TFundItem, index: number) => {
      return {
        ...item,
        list: (item.list ?? []).map((el, i) => {
          return { ...el, isActive };
        }),
      };
    });
    setFundList(arrayList);
  };
  /**
   * 选中基金
   * @param el
   */
  const selectFund = (el: {
    code: number;
    fund_name: string;
    isActive: boolean;
    item_type: number;
  }) => {
    fundList.map((item, index) => {
      item.list.map((ele, index) => {
        if (ele.code == el.code && item.type == el.item_type) {
          ele.isActive = !el.isActive;
        }
      });
    });
    let arr = [...fundList],
      selectArr: boolean[] = [];
    arr.map((el, index) => {
      el.list.map((item) => {
        selectArr.push(item.isActive);
      });
    });
    let bool = selectArr.every((item) => item);
    setAllSelect(bool);
    setFundList([...fundList]);
  };
  return (
    <>
      {loading ? (
        <LoadingTip />
      ) : (
        <View className="edit_fund_box">
          <View
            className="content_list"
            style={{
              paddingBottom: 58 + screenBottom,
            }}
          >
            {fundList?.map((item, index) => {
              return (
                <View className="edit_fund_box_list">
                  <View className="fund_nav">
                    <Text className="title">{item.type_name}</Text>
                  </View>
                  <View className="list_item">
                    <View className="header">
                      <View className="header_wrap">
                        <Text className="title">基金名称</Text>
                      </View>
                    </View>
                    {(item.list ?? []).map((el, index) => {
                      return (
                        <View
                          className="list_item_content"
                          onClick={() => selectFund(el)}
                        >
                          <View className="list_row_wrap">
                            <View className="left_wrap">
                              <Image
                                src={el.isActive ? selected : noSelected}
                                className="icon"
                              />
                              <View className="left_wrap_right">
                                <Text className="fund_name">
                                  {el.fund_name}
                                </Text>
                                <Text className="fund_code">{el.code}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
          <FixedView position="bottom" safeArea="bottom">
            <View className="del_fund">
              <View className="del_fund_wrap">
                <View
                  className="left_side"
                  onClick={() => {
                    setAllSelect((prev) => {
                      !prev ? isAll(fundList, true) : isAll(fundList, false);
                      return !prev;
                    });
                  }}
                >
                  <Image
                    src={allSelect ? selected : noSelected}
                    className="icon"
                  />
                  <Text className="allSel">全选</Text>
                </View>
                <View className="right_side" onClick={deleteFund}>
                  <Text>删除基金</Text>
                </View>
              </View>
            </View>
          </FixedView>
        </View>
      )}
    </>
  );
};

export default ArrangeFund;
