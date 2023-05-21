import React from "react";
import { View } from "@tarojs/components";
import { Loading } from "@taroify/core";
import "./index.less";
const LoadingTip = () => {
  return (
    <View className="loading_wrap">
      <Loading type="spinner" size="30px" />
    </View>
  );
};
export default LoadingTip;
