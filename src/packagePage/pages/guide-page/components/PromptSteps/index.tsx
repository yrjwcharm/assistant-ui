import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import React, { FC, useState } from "react";

import "./index.less";

import closeImg from "@/assets/images/icons/close.png";

interface IProps {
  images: {
    imgurl: string; //图片链接
    content: string; //文案描述
    child_type: string;
  }[];
  onStart: () => any;
}

const PromptSteps: FC<IProps> = ({ images, onStart }) => {
  // const [indicatorDots, setIndicatorDots] = useState<boolean>(true);
  const [current, setCurrent] = useState<number>(0);
  const [finish, setFinish] = useState<boolean>(false);
  return (
    <View className="prompt-steps-mask">
      <View className="prompt-steps-modal-C">
        <View
          className="prompt-steps-modal-close"
          onClick={() => {
            onStart && onStart();
          }}
        >
          <Image
            src={closeImg}
            style={{
              width: "42rpx",
              height: "62rpx"
            }}
          />
        </View>
        <Swiper
          className="prompt-steps-modal"
          indicatorColor="#E9EAEF"
          indicatorActiveColor="#0051CC"
          onAnimationFinish={e => {
            setCurrent(e.detail.current);
            if (e.detail.current === images.length - 1) {
              setFinish(true);
              // setIndicatorDots(false);
            } else {
              setFinish(false);
              // setIndicatorDots(true);
            }
          }}
          onChange={() => {}}
          // indicatorDots={indicatorDots}
          indicatorDots={false}
        >
          {images?.map(item => {
            return (
              <SwiperItem>
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative"
                  }}
                >
                  <Image
                    src={item.imgurl}
                    style={{
                      width: "100%",
                      height: "100%"
                    }}
                    onClick={() => {
                      if (finish) {
                        onStart && onStart();
                      }
                    }}
                  />
                  {finish ? null : (
                    <View className="point-container">
                      {images.map((_item, index) => {
                        return (
                          <View
                            key={index}
                            className={`${
                              current === index ? "point-active" : "point"
                            }`}
                            style={{
                              marginLeft: index === 0 ? 0 : "16rpx"
                            }}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              </SwiperItem>
            );
          })}
        </Swiper>
      </View>
    </View>
  );
};

export default PromptSteps;
