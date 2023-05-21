/*
 * @Date: 2023-01-06 11:38:18
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-01-12 10:57:58
 * @FilePath: /assistant-ui/src/packageLession/pages/article/lessions.tsx
 * @Description:
 */

import React, { useState, useContext } from "react";
import { View, Text, Image, ITouchEvent } from "@tarojs/components";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import { useStoreState } from "@/hooks";
import LockImg from "../../assets/lessions/lock-fill.png";
import ArrowDownImg from "../../assets/lessions/arrow-down.png";
import ArrowUpImg from "../../assets/lessions/arrow-up.png";
import "./lessions.less";
import Taro from "@tarojs/taro";

export interface IArticle {
  id: number; // 文章id
  title: string; // 文章标题
  cover?: string; // 文章封面
  type: 1 | 2 | 3; // 文章类型  1普通文章 2音频文章 3视频文章'
  is_lock: 0 | 1; // 是否上锁  0否  1是
}

/** 课程 */
export interface ILession {
  id: number;
  title: string;
  sub_title?: string;
  articles: IArticle[];
}

const typeMap = ["", "文章", "音频", "视频"];

function ArtcleItem(props: { item: IArticle }) {
  const { item } = props;
  const {
    global: { userType },
  } = useStoreState();
  const isAuth = userType === "2";

  const { handleOpenLock } = useContext(EventContext);

  const typeStr = typeMap[item.type];
  const hasLock = item.is_lock === 1;

  const [renderPhoneAuthButton] = usePhoneAuthorization({
    afterLoginCb: () => {},
  });

  const handleClick = () => {
    if (hasLock) {
      handleOpenLock && handleOpenLock(item);
      return;
    }
    Taro.navigateTo({
      url: `/packageLession/pages/article/detail?article_id=${item.id}&from=list`,
    });
  };

  return (
    <View
      className="article"
      onClick={
        (isAuth ? handleClick : null) as
          | ((event: ITouchEvent) => void)
          | undefined
      }
    >
      <View className="article-tag-wrap">
        <Text className="article-tag">{typeStr}</Text>
      </View>
      <View className="article-title-wrap">
        <Text className="article-title">{item.title}</Text>
      </View>
      <View className="lock-wrap">
        {hasLock && <Image className="lock" src={LockImg} />}
      </View>
      {!isAuth && renderPhoneAuthButton()}
    </View>
  );
}

function Lession({ lession }: { lession: ILession }) {
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <View>
      <View className="lession-header" onClick={handleClick}>
        <View className="lession-title-wrap">
          <Text className="lession-title">{lession.title}</Text>
          {lession.sub_title && <Text className="lession-middle">|</Text>}
          {lession.sub_title && (
            <Text className="lession-subtitle">{lession.sub_title}</Text>
          )}
        </View>
        <View className="lession-arrow-wrap">
          <Image
            className="lession-arrow"
            src={open ? ArrowUpImg : ArrowDownImg}
          />
        </View>
      </View>
      <View className={`lession-content ${open ? "open" : "close"}`}>
        {(lession.articles || []).map((item) => (
          <ArtcleItem item={item} key={item.id + ""} />
        ))}
      </View>
    </View>
  );
}

const eventHandles: {
  handleOpenLock: any;
} = {
  handleOpenLock: null,
};

const EventContext = React.createContext(eventHandles);

export default function LessionList({
  banner,
  openLock,
  list = [],
}: {
  banner: string;
  openLock: Function;
  list: ILession[];
}) {
  return (
    <EventContext.Provider value={{ handleOpenLock: openLock }}>
      <View className="lessions-list">
        <Image src={banner} className="lessions-banner"></Image>
        <>
          {(list || []).map((lession, index) => (
            <Lession lession={lession} key={lession.id + ""} />
          ))}
        </>
      </View>
    </EventContext.Provider>
  );
}
