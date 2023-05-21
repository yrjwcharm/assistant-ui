/*
 * @Date: 2023-02-20 17:02:32
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-02 20:24:26
 * @FilePath: /assistant-ui/src/views/ActiveBall/OneBuyBall.tsx
 * @Description:
 */
import React, { useEffect, useRef, useState } from "react";
import { View, Image, ITouchEvent } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";

import FloatBall from "@/components/FloatBall/FloatBall";

import { callGetAllPageActivity } from "./services";
import CacheManage from "@/utils/cacheManage";
import { useStoreState } from "@/hooks";
import "./OneBuyBall.less";
import { sendPoint } from "@/utils/sendPoint";
import { getPageId } from "@/config/page";
import { usePage } from "taro-hooks";
interface ISpecialActivityDetail {
  show_txt: string;
  type: string; // 'one'
  url: string;
  user_level: number;
}

interface IPageActivity {
  [key: string]: {
    oneBuy?: ISpecialActivityDetail;
    buyCountDown?: ISpecialActivityDetail;
    specialChannel?: ISpecialActivityDetail;
  };
}

interface IProps {
  path?: string;
}

// 点击延期 图片
const postponeImg =
  "https://static.licaimofang.com/wp-content/uploads/2023/02/postpone.png";
// 专属折扣倒计时  图片
const specialImg =
  "https://static.licaimofang.com/wp-content/uploads/2023/02/special.png";
// 体验买卖信号  图片
const trialImg =
  "https://static.licaimofang.com/wp-content/uploads/2023/02/trial.png";

/** 活动缓存 */
const oneBuyCache = new CacheManage<IPageActivity>({
  name: "oneBuyCache",
  expireDuration: 1000, // 2 分钟最多请求一次
  newDataFunc: () => {
    return callGetAllPageActivity();
  },
});

export default function OneBuyBall(props: IProps) {
  const {
    global: { userType },
  } = useStoreState();
  const [show, setShow] = useState(false);
  const [oneBuy, setOneBuy] = useState<ISpecialActivityDetail>();
  const [special, setSepcial] = useState<ISpecialActivityDetail>();
  const [postpone, setPostpone] = useState<ISpecialActivityDetail>();
  const activityNameRef = useRef<string>("");
  //获取当前页面实例
  const [, { pageInstance }] = usePage();

  const handleClose = (e: ITouchEvent) => {
    e.stopPropagation();
    setShow(false);
  };

  const handleClick = () => {
    const item: ISpecialActivityDetail | undefined =
      oneBuy || special || postpone;

    if (!item) return;

    sendPoint({
      pageid: getPageId(),
      event: "click",
      ctrl: "floating_ad",
      oid: activityNameRef.current,
    });

    // 到我的页面
    if (item.url.indexOf("pages/member-buy/index") !== -1) {
      Taro.switchTab({
        url: "/pages/member-buy/index",
      });
    } else {
      Taro.navigateTo({
        url: item.url,
      });
    }
  };
  useEffect(() => {
    if (oneBuy || special || postpone) {
      sendPoint({
        pageid: getPageId(),
        event: "view",
        ctrl: "floating_ad",
        oid: activityNameRef.current,
      });
      console.log("OneBuyBall:", oneBuy || special || postpone);
    }
  }, [oneBuy, special, postpone]);
  useDidShow(() => {
    userType == "2" && loadPageAcitivty();
  });
  const loadPageAcitivty = () => {
    oneBuyCache.get().then((res) => {
      //获取当前页面路由实例-path
      const pathKey = pageInstance.router?.path ?? "";
      //拿到实体对象
      const activities = res[pathKey];
      if (activities) {
        setOneBuy(activities?.oneBuy);
        setShow(true);
        setSepcial(activities?.specialChannel);
        setPostpone(activities?.buyCountDown);
      } else {
        setShow(false);
      }
    });
  };
  useEffect(() => {
    oneBuyCache.clear();
    loadPageAcitivty();
    const timer = setTimeout(loadPageAcitivty, 2 * 1000);
    return () => {
      timer && clearTimeout(timer);
    };
  }, [userType]);

  useEffect(() => {
    function handlePageShow() {}
    Taro.eventCenter.on("page_show", handlePageShow);
    return () => {
      Taro.eventCenter.off("page_show", handlePageShow);
    };
  });

  const style = {
    display: show ? "fixed" : "none",
  };

  let content = null;
  if (oneBuy) {
    content = (
      <View className="oneBuy animator">
        <Image className="img" mode="widthFix" src={trialImg} />
        <View className="text">{oneBuy.show_txt}</View>
      </View>
    );
  }
  if (special) {
    content = (
      <View className="special animator">
        <Image className="img" mode="widthFix" src={specialImg} />
        <View className="text">{special?.show_txt ?? "7天"}</View>
      </View>
    );
  }

  if (postpone) {
    content = (
      <View className="postpone animator">
        <Image className="img" mode="widthFix" src={postponeImg} />
        <View className="textWrap">
          <View>{postpone?.show_txt ?? "7天"}</View>
          <View className="desc">信号倒计时</View>
        </View>
      </View>
    );
  }

  return (
    <FloatBall
      show={show}
      style={style}
      onClose={handleClose}
      onClick={handleClick}
    >
      {content}
    </FloatBall>
  );
}
