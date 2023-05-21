/*
 * @Date: 2023-02-07 15:03:07
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-08 13:58:48
 * @FilePath: /assistant-ui/src/pages/hold/components/Banner.tsx
 * @Description:
 */
import { Image, View,Swiper, SwiperItem } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { sendPoint } from "@/utils/sendPoint";
import { callBannerListApi } from "../services";
import "../index.less";

export default function Banner() {
  const [bannerList, setBannerList] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await callBannerListApi();
      setBannerList(res);
    })();
  }, []);

  const jumpUrl = (el: { img_url?: string; path?: any; }, index: number) => {
    switch (index) {
      case 0:
        Taro.navigateTo({
          url: el.path,
        });
        break;
      case 1:
        sendPoint({
          pageid: "homepagedraw",
          ts: Date.now(),
          event: "click",
        });
        Taro.navigateTo({
          url: el.path,
        });
        break;
    }
  };

  return (
    <View className="img_wrap_banner">
      <Swiper
        className="banner_swiper"
        indicatorColor="#999"
        indicatorActiveColor="#333"
        circular
        duration={500}
        autoplay
      >
        {bannerList?.map((el: { img_url: string }, index: number) => {
          return (
            <SwiperItem
              className="swiper_item"
              onClick={() => jumpUrl(el, index)}
            >
              <Image
                mode="widthFix"
                src={el.img_url}
                className="swiper_item_img"
              />
            </SwiperItem>
          );
        })}
      </Swiper>
    </View>
  );
}
