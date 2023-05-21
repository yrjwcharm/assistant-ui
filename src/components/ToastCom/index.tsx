import { View, Text } from "@tarojs/components";
import React, { FC } from "react";

import "./index.less";
interface IProps {
  status: boolean;
  text: string;
}

const ToastCom: FC<IProps> = ({ status, text }) => {
  if (status) {
    return (
      <View className="toast-com-container">
        <View className="toast-container">
          <Text>{text}</Text>
        </View>
      </View>
    );
  } else {
    return null;
  }
};

export default React.memo(ToastCom);
