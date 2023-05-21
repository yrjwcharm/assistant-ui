/*
 * @Date: 2023/3/10 19:49
 * @Author: yanruifeng
 * @Description:
 */

import { ITouchEvent, Text, View } from "@tarojs/components";
import { Backdrop } from "@taroify/core";
import React from "react";
type IProps = {
  visible: boolean;
  popInfo: string;
  upgradeClick: (e: ITouchEvent) => void;
  button_info: string;
  mangeFundClick: (e: ITouchEvent) => void;
};
const UnlockFundDialog = ({
  visible,
  popInfo,
  upgradeClick,
  button_info,
  mangeFundClick,
}: IProps) => {
  return (
    <Backdrop closeable={false} open={visible}>
      <View className="pop_content_wrapper">
        <View className="head_title">
          <Text>当前已解锁{popInfo}支，无法再解锁新的基</Text>
          <Text>金信号。您可以通过取消解锁来释</Text>
          <Text>放额度。</Text>
        </View>
        <View className="upgrade_btn" onClick={upgradeClick}>
          <Text>{button_info}</Text>
        </View>
        <View className="manage_fund" onClick={mangeFundClick}>
          去管理我已解锁的基金
        </View>
      </View>
    </Backdrop>
  );
};
export default UnlockFundDialog;
