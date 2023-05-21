/*
 * @Date: 2023-02-07 15:12:37
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-07 15:17:18
 * @FilePath: /assistant-ui/src/pages/hold/components/HoldTotal.tsx
 * @Description:
 */
import { Image, View, Text } from "@tarojs/components";
import React, { useMemo, useState } from "react";
import getValueColor from "@/utils/getValueColor";
import closedEyes from "@/assets/images/icons/closed-eyes.png";
import eyes from "@/assets/images/icons/eye.png";
export default function HoldTotal(props: { assetInfo: any }) {
  const { assetInfo } = props;
  const [eyesStatus, setEyesStatus] = useState<boolean>(true); // true: eyes; false: closedEyes;
  const date = useMemo(() => {
    const _date = new Date();
    const _month = _date.getMonth() + 1;
    const _day = _date.getDate();
    return `${_month}-${_day}`;
  }, []);

  return (
    <View className="hold-cumulative">
      <View
        className="total-assets"
        onClick={() => {
          setEyesStatus(!eyesStatus);
        }}
      >
        <View className="total-assets-title">
          <Text>总资产(元)</Text>
          <Text
            style={{
              fontSize: "22rpx",
              lineHeight: "31rpx",
              marginLeft: "16rpx",
            }}
          >
            {date}
          </Text>
          <Image
            src={eyesStatus ? eyes : closedEyes}
            style={{
              width: "32rpx",
              height: "32rpx",
              marginLeft: "16rpx",
            }}
          />
        </View>
        <View className="total-assets-money">
          {eyesStatus ? assetInfo?.total_assets || 0.0 : "*.**"}
        </View>
      </View>
      <View className="profit-container">
        <View>
          <Text className="key">当日总收益</Text>
          <Text
            className="value"
            style={{
              color: eyesStatus
                ? getValueColor(`${assetInfo?.valuation_cur_assets || 0.0}`)
                : "#121D3A",
            }}
          >
            {eyesStatus ? assetInfo?.valuation_cur_assets || 0.0 : "*.**"}
          </Text>
        </View>
        <View>
          <Text className="key">累计收益</Text>
          <Text
            className="value"
            style={{
              color: eyesStatus
                ? getValueColor(`${assetInfo?.position_income || 0.0}`)
                : "#121D3A",
            }}
          >
            {eyesStatus ? assetInfo?.position_income || 0.0 : "*.**"}
          </Text>
        </View>
      </View>
    </View>
  );
}
