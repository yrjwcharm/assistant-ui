import React, { Component } from "react";
import { Image, View } from "@tarojs/components";
import classNames from "classnames";
import "./FloatBall.less";
import closeImg from "@/assets/images/fission-activity/close.png";
import {
  systemInfo,
  screenTop,
  navbarHeight,
  tabbarHeight,
} from "@/config/layoutSize";
interface IProps {
  style?: Object;
  /** 是否有导航栏，默认有 */
  hasNavbar?: boolean;
  /** 是否有tabbar，默认有 */
  hasTabbar?: boolean;
  show?: boolean;

  /** 关闭悬浮球 */
  onClose: Function;
  /** 点击事件 */
  onClick: Function;
  children?: any;
}
interface IState {
  oLeft: number;
  oTop: number;
  show: boolean;
  /** 动画步骤 */
  animatorStep: 0 | 1 | 2 | 3;
}

// 悬浮按钮尺寸
const kBallWidth: number = 70; // 悬钮宽度
const kBallHeight: number = 70;

class FloatBall extends Component<IProps, IState> {
  $vm: any; // 悬浮按钮
  moving: boolean; // 移动状态

  preTouchX: number; // 悬钮距离
  preTouchY: number;

  htmlWidth: number; // 页面宽度
  htmlHeight: number;

  click: boolean; // 是否是点击

  minY: number;
  maxY: number;

  timer: NodeJS.Timeout; // 清除动画

  constructor(props: IProps) {
    super(props);
    this.state = {
      oLeft: systemInfo.screenWidth - kBallWidth,
      oTop: systemInfo.screenHeight / 2 - kBallHeight,
      animatorStep: 0,
      show: true,
    };
    this.click = false;
    this.moving = false;

    this.htmlWidth = systemInfo.screenWidth;
    this.htmlHeight = systemInfo.screenHeight;
    const hasNavbar = props.hasNavbar === undefined || props.hasNavbar;
    const hasTabbar = props.hasTabbar === undefined || props.hasTabbar;

    this.minY = hasNavbar ? navbarHeight : screenTop!;
    this.maxY = hasTabbar
      ? systemInfo.screenHeight - tabbarHeight
      : systemInfo.safeArea?.bottom ?? systemInfo.screenHeight;
  }
  render() {
    const { style, children } = this.props;
    const { animatorStep, show } = this.state;

    const className = classNames([
      "floatball-button",
      `animator-step-${animatorStep}`,
    ]);

    if (!show) return null;
    return (
      <View
        onClick={() => {
          !this.click && this.props.onClick();
        }}
        className={className}
        style={{
          width: kBallWidth,
          height: kBallHeight,
          right: "10px",
          top: `${this.state.oTop}px`,
          ...style,
        }}
      >
        <View
          className="closeWrap"
          onClick={(e) => {
            this.props.onClose(e);
          }}
        >
          {show && <Image className="closeImg" src={closeImg} />}
        </View>
        {children}
      </View>
    );
  }
}

export default FloatBall;
