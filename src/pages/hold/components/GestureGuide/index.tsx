/*
 * @Date: 2023-02-06 10:36:00
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-21 13:42:49
 * @FilePath: /assistant-ui/src/pages/hold/components/GestureGuide/index.tsx
 * @Description:
 */
import { View, Image } from "@tarojs/components";
import React, { FC, useEffect, useState } from "react";

import "./index.less";
import { getStorage, setStorage } from "@/utils/local";

// import aboutGesture from "@/assets/images/hold/about.gif";
import Taro from "@tarojs/taro";

// @ts-ignore
import handIcon from "@/assets/images/icons/hand.png";

// 引导类型
enum GuideType {
  None = -1, // 不显示
  PanLeft = 1, // 左滑
  DefultOne = 2, // 点击默认的第一个
}
interface IProps {
  bindTableId?: string;
  tableHeight?: number;
}

function querySize(
  id: string,
  cb: Taro.NodesRef.BoundingClientRectCallback | undefined
) {
  Taro.createSelectorQuery().select(id).boundingClientRect(cb).exec();
}

interface QRect {
  bottom: number;
  height: number;
  right: number;
  left: number;
  top: number;
  width: number;
}

const GestureGuide: FC<IProps> = ({ bindTableId }) => {
  const [showGuideType, setShowGuideType] = useState<number>(GuideType.None); // 是否显示左滑提醒

  const [tableRect, setTableRect] = useState<QRect>({
    bottom: 0,
    height: 0,
    right: 0,
    left: 0,
    top: 0,
    width: 0,
  });
  const [navRect, setNavRect] = useState<QRect>({
    bottom: 0,
    height: 88,
    right: 0,
    left: 0,
    top: 0,
    width: 0,
  });

  useEffect(() => {
    querySize(".fixed_nav", (_rect: QRect) => {
      if (!_rect || _rect.width <= 0) return;
      setNavRect(_rect);
    });
  }, []);

  useEffect(() => {
    if (!bindTableId || showGuideType === GuideType.None) {
      return;
    }
    let count = 10;
    const timer = setInterval(() => {
      if (!bindTableId || showGuideType == GuideType.None) {
        clearInterval(timer);
      }
      count = count - 1;
      if (count < 0) {
        clearInterval(timer);
        return;
      }
      if (count > 5) return;
      querySize(bindTableId, (_rect) => {
        if (!_rect || _rect.width <= 0) return;
        console.log("setTableRect:", _rect);
        setTableRect(_rect);
      });
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, [bindTableId, showGuideType]);

  useEffect(() => {
    const showOnewGuide = getStorage("showOnewGuide") === "true";
    if (showOnewGuide) {
      setShowGuideType(GuideType.DefultOne);
      return;
    }

    const showHandleGuide = getStorage("leftSlideGesture") !== "hide";
    if (showHandleGuide) {
      setShowGuideType(GuideType.PanLeft);
      return;
    }
  }, []);

  if (showGuideType === GuideType.None)
    return (
      <View
        style={{
          width: 0,
        }}
        className="gesture-guide-container"
      />
    );

  if (showGuideType === GuideType.DefultOne && tableRect.width > 0) {
    return (
      <View
        className="hold-guide-tips"
        style={{
          paddingTop: "44px",
          width: "100%",
          top: tableRect.top - navRect.height + 45 + "px",
          minHeight: "140px",
          height: tableRect?.height + 114 + "px",
          overflow: "hidden",
        }}
        onClick={() => {
          setStorage("showOnewGuide", "false");
          setShowGuideType(GuideType.None);
        }}
      >
        <Image src={handIcon} />
        <View className="copywriting">以上为默认上传的基金，</View>
        <View className="copywriting">点击可看到该基金买卖点信号详情</View>
        <View className="button">知道了</View>
      </View>
    );
  }

  if (showGuideType === GuideType.PanLeft && tableRect.width > 0) {
    return (
      <View
        className="gesture-guide-container"
        style={{
          width: "100%",
          // bottom: 0,
          top: tableRect.top - navRect.height + "px",
          minHeight: "140px",
          height: `calc(${tableRect.height}px + 114rpx)`,
          overflow: "hidden",
        }}
        onClick={() => {
          setStorage("leftSlideGesture", "hide");
          setShowGuideType(GuideType.None);
        }}
      >
        <View>
          <View className="gesture-text">向左滑动</View>
          <View className="gesture-text">查看更多内容</View>
          <Image
            className="gesture-img"
            src={
              "https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_about.gif"
            }
          />
          <View className="gesture-button">知道了</View>
        </View>
      </View>
    );
  }

  return null;
};

export default GestureGuide;
