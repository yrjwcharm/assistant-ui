import Taro, { useRouter } from "@tarojs/taro";
import React, { FC, useEffect, useState } from "react";
import { View, Image } from "@tarojs/components";

import "./index.less";

import PromptSteps from "./components/PromptSteps";

// import bg from "./img.png";
// import bg2 from "./img2.png";
import { useStoreState } from "@/hooks";
import HomeNavNav from "@/components/HomeNav";
import CustomTabBar from "@/components/CustomTabBar";

const GuidePage: FC = () => {
  const {
    global: { guideModal }
  } = useStoreState();

  const { params } = useRouter();

  const [next, setNext] = useState<boolean>(false);

  useEffect(() => {
    Taro.hideHomeButton();
  }, []);

  const renderSwiper = () => {
    return (
      <View
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <Image
          src={params.pageid && params.pageid === "optional" ? 'https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_img2.png' : 'https://static.licaimofang.com/wp-content/uploads/2022/12/ass-1_img1.png'}
          style={{
            width: "100%",
            height: "100%"
          }}
        />
        {guideModal.pop.length > 0 ? (
          <PromptSteps
            onStart={() => {
              if (guideModal?.pop_todo && guideModal?.pop_todo[0]?.imgurl) {
                setNext(true);
              } else {
                // Taro.switchTab({
                //   url: "/pages/hold/index"
                // });
                Taro.navigateBack();
              }
            }}
            images={guideModal.pop}
          />
        ) : null}
      </View>
    );
  };

  const renderNext = () => {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "relative"
        }}
      >
        <Image
          src={guideModal.pop_todo[0].imgurl}
          style={{
            width: "100%",
            height: "100%"
          }}
          onClick={() => {
            // Taro.switchTab({
            //   url: "/pages/hold/index"
            // });
            Taro.navigateBack();
          }}
        />
      </View>
    );
  };

  return (
    <View className="guide-container">
      <HomeNavNav nohead={true} title="基金理财助手" />
      <View
        style={{
          flex: 1,
        }}
      >
        {guideModal?.pop?.length > 0
          ? next
            ? renderNext()
            : renderSwiper()
          : renderNext()}
      </View>
      <CustomTabBar
        path={
          params.pageid && params.pageid === "optional"
            ? "pages/optional/index"
            : "pages/hold/index"
        }
      />
    </View>
  );
};

export default GuidePage;
