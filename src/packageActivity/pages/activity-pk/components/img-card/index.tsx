import React, { FC, useEffect } from "react";
import { View, Image } from "@tarojs/components";

import "./index.less";

interface IProps {
  imgUrl: string;
}

const ImgCard: FC<IProps> = ({ imgUrl }) => {
  useEffect(() => {}, []);

  return (
    <View
      style={{
        width: "100%",
        padding: "32rpx",
        borderRadius: "8rpx",
        background: "#fff"
      }}
    >
      <Image
        mode="widthFix"
        src={imgUrl}
        style={{
          width: "100%",
          borderRadius: "8rpx"
        }}
      />
    </View>
  );
};

export default React.memo(ImgCard);
