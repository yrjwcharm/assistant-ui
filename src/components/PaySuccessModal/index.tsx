/*
 * @Date: 2023-01-31 16:06:31
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-03 15:05:20
 * @FilePath: /assistant-ui/src/components/PaySuccessModal/index.tsx
 * @Description:
 */
import React, { useCallback } from "react";
import { View, Text, Image } from "@tarojs/components";

import "./index.less";
import Taro from "@tarojs/taro";
import { throttle } from "@/tools/debounce";
export interface IProps {
  // withFound;
  // _ref
  show: boolean;
  onClose: (arg0: boolean) => void;
  onUnLock?: () => void;
  withFound: boolean;
  withConfig: {
    pop_type?: 1 | 2 | 3;
    pop_title?: string;
    pop_img_url?: string;
    activity_url?: string;
  };
}

export default function PaySuccessModal(props: IProps) {
  const { show, onClose, onUnLock, withConfig = {}, withFound = true } = props;

  const handleNav = () => {
    if (!withConfig.activity_url) return;
    Taro.navigateTo({
      url: withConfig.activity_url,
    });
    onClose(false);
  };

  // 反正跳多次
  const handleClose = useCallback(
    throttle(() => {
      onClose(false);
      !withFound &&
        Taro.navigateTo({
          url: "/packagePage/pages/follow-official-account/index?back_type=2",
        });
    }, 200),
    [withFound]
  );

  if (!show) return null;
  return (
    <View className="paySuccessModal">
      <View className="bg" onClick={handleClose} />
      <View className="center_modal">
        <View className="closeWrap" onClick={handleClose}>
          <Image
            className="img"
            src={require("@assets/images/mine/close-fill.png")}
          />
        </View>
        <View className="modal_header">
          <Image
            className="success_icon"
            src="https://static.licaimofang.com/wp-content/uploads/2023/01/pay_success_icon.png"
          />
          <View className="title">
            <Text>{withConfig?.pop_title ?? "恭喜您套餐购买成功"}</Text>
          </View>
          {[1, 3].indexOf(withConfig?.pop_type ?? 1) !== -1 && (
            <Image
              showMenuByLongpress={true}
              className="desc"
              src={
                withConfig?.pop_img_url ??
                "https://static.licaimofang.com/wp-content/uploads/2023/03/pay-sucess.png"
              }
            />
          )}
          {withConfig?.pop_type === 2 && (
            <View className="configWrap">
              <Image
                className="configImg"
                showMenuByLongpress={true}
                src={withConfig.pop_img_url ?? ""}
                mode="aspectFit"
              />
            </View>
          )}
        </View>
        {withFound && [1, 3].indexOf(withConfig?.pop_type ?? 1) !== -1 && (
          <View className="modal_footer">
            <View className="skip" onClick={() => onClose(false)}>
              <Text>稍后解锁</Text>
            </View>
            <View className="unlock" onClick={onUnLock}>
              <Text>立即解锁本基金</Text>
            </View>
          </View>
        )}
        {withConfig?.pop_type === 2 && (
          <View className="modal_footer config">
            <View className="more" onClick={handleNav}>
              <Text>点击查看更多</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
