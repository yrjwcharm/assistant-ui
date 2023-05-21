import React, { FC, useEffect } from "react";
import { View, Image } from "@tarojs/components";

import "./index.less";

interface IProps {
  imgUrl: string;
}

const TopComp: FC<IProps> = ({ imgUrl }) => {
  useEffect(() => {}, []);

  return (
    <View
      style={{
        width: "100%",
        position: "relative",
        zIndex: 1
      }}
    >
      <Image
        mode="widthFix"
        src={imgUrl}
        style={{
          width: "100%"
        }}
      />
    </View>
  );
};

export default React.memo(TopComp);
// export default TopComp;
