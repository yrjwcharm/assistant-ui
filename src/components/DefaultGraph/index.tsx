/* eslint-disable jsx-quotes */
import { View, Image, Text } from "@tarojs/components";
import React, { FC } from "react";

// @ts-ignore
import noData from "@/assets/images/default-graph/no-data.png";
// @ts-ignore
import noReminder from "@/assets/images/default-graph/no-reminder.png";

import "./index.less";

type DefaultGraphType = "no-data" | "no-reminder" | "custom"; // custom: 自定义图片

interface DefaultProps {
  type?: DefaultGraphType;
  title?: string;
  subtitle?: string | string[];
  containerStyle?: string | React.CSSProperties | undefined;
  imgSrc?: string;
}

const DefaultGraph: FC<DefaultProps> = ({
  type = "no-data",
  containerStyle,
  title,
  subtitle,
  imgSrc
}) => {
  const getImage = (key: DefaultGraphType) => {
    switch (key) {
      case "no-data":
        return <Image src={noData} />;
      case "no-reminder":
        return <Image src={noReminder} />;
      case "custom":
        if (imgSrc) {
          return <Image src={imgSrc} />;
        } else {
          console.error("请传入图片路径");
          break;
        }
      default:
        return null;
    }
  };

  const renderSubTitle = () => {
    if (subtitle) {
      if (typeof subtitle === "string") {
        return <Text className="default-graph-subtitle">{subtitle}</Text>;
      } else {
        return subtitle.map(item => {
          return <Text className="default-graph-subtitle">{item}</Text>;
        });
      }
    } else {
      return null;
    }
  };

  return (
    <View style={containerStyle || {}} className="default-graph-c">
      {getImage(type)}
      {title ? <Text className="default-graph-title">{title}</Text> : null}
      {renderSubTitle()}
    </View>
  );
};

export default DefaultGraph;
