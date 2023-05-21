/* eslint-disable jsx-quotes */
import { View } from "@tarojs/components";
import React, {FC, ReactNode, useState} from "react";
import {
  btnGhostStyle,
  btnPrimaryStyle,
  btnRedStyle,
  btnNoneStyle
} from "./variables";

import "./index.less";

interface BtnProps {
  type?: "primary" | "ghost" | "red" | "none";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  containerStyle?: any;
  children?:ReactNode;
  onClick?: (params?: any) => any;
}
/**
 * 在不写入onPress方法时点击不会呈现效果
 * @param {primary | ghost | red | none} type
 * @param {sm | md | lg} size
 * @param {boolean} disabled
 * @param
 */
const Button: FC<BtnProps> = props => {
  const { children, type = "primary" } = props;
  // 控制传入参数类型
  // if (typeof children !== "string") {
  //   throw new Error("按钮组件暂只支持传入文本作为展示");
  // }
  let currentStyle = btnPrimaryStyle;
  // 控制配色方案
  switch (type) {
    case "primary":
      currentStyle = btnPrimaryStyle;
      break;
    case "ghost":
      currentStyle = btnGhostStyle;
      break;
    case "red":
      currentStyle = btnRedStyle;
      break;
    case "none":
      currentStyle = btnNoneStyle;
      break;
    default:
      currentStyle = btnPrimaryStyle;
      break;
  }

  const [pressStatus] = useState<boolean>(false);

  const getViewStyle = () => {
    return Object.assign(
      pressStatus
        ? {
            backgroundColor: currentStyle.active_bg_color,
            borderColor: currentStyle.active_border_color
          }
        : {
            backgroundColor: currentStyle.primary_bg_color,
            borderColor: currentStyle.primary_border_color
          }
      // styles.commonView
    );
  };
  const getTextStyle = () => {
    return Object.assign(
      pressStatus
        ? {
            color: currentStyle.active_text_color
          }
        : {
            color: currentStyle.primary_text_color
          }
      // styles.commonText
    );
  };
  // const _onHideUnderlay = () => {
  //   setPressStatus(false)
  //   props?.onHideUnderlay && props?.onHideUnderlay()
  // }
  // const _onShowUnderlay = () => {
  //   setPressStatus(true)
  //   props?.onShowUnderlay && props?.onShowUnderlay()
  // }
  return (
    <View
      className="btn-container"
      style={{
        width: "100%",
        height: "88rpx",
        ...getViewStyle(),
        ...getTextStyle()
      }}
      onClick={() => {
        // setPressStatus(!pressStatus);
        props.onClick && props.onClick();
      }}
    >
      {children}
    </View>
  );
};

export default Button;
