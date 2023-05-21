import { View, Image, Input } from "@tarojs/components";
import React, { FC, useLayoutEffect, useState } from "react";

import "./index.less";
import Taro, { useRouter } from "@tarojs/taro";
import Button from "@/components/Button";

import addIcon from "../../assets/images/add.png";
import reduceIcon from "../../assets/images/reduce.png";
import { useStoreDispatch, useStoreState } from "@/hooks";
import { Toast } from "@/components/Toast";
const EditFund: FC = () => {
  const {
    fund: { fundInfo },
  } = useStoreState();
  const dispatch = useStoreDispatch();

  const router = useRouter();
  const { index, goBack, activity_id, schedule_id } = router.params as {
    index: string;
    goBack: "1" | undefined;
    activity_id?: string | undefined; // 活动id;
    schedule_id?: string | undefined; // 期数id
  };

  const isUndefined = typeof index === "undefined";
  Taro.setNavigationBarTitle({
    title: isUndefined ? "增加持仓" : "修改持仓",
  });

  const [fundName, setFundName] = useState<string>(
    isUndefined ? "" : fundInfo[~~index].fund_name
  ); // 基金名称
  const [fundCode, setFundCode] = useState<string>(
    isUndefined ? "" : fundInfo[~~index].fund_code
  ); // 基金code
  const [money, setMoney] = useState<string>(
    isUndefined ? "" : fundInfo[~~index].owned_amount ?? ""
  ); // 持有金额
  // const [moneyMaxlength, setMoneyMaxlength] = useState<number>(7);
  const [profit, setProfit] = useState<string>(
    isUndefined
      ? ""
      : fundInfo[+index].profit === ""
      ? ""
      : `${Math.abs(parseFloat(fundInfo[+index].profit as string))}`
  ); // 持有收益
  const [symbol, setSymbol] = useState<"add" | "reduce">(
    isUndefined
      ? "add"
      : fundInfo[~~index].profit ?? "".indexOf("-") === -1
      ? "add"
      : "reduce"
  );
  const saveFund = async () => {
    if (!fundName || money === "" || profit === "") {
      Toast.fail("请确保基金信息完整");
      return;
    }
    if (parseFloat(money) >= 10000000) {
      Toast.fail("小数点前最多填写7位，精确到小数点后两位");
      return;
    }
    if (parseFloat(profit) >= 10000000) {
      Toast.fail("小数点前最多填写7位，精确到小数点后两位");
      return;
    }
    if (
      (symbol === "add" && parseFloat(profit) >= parseFloat(money)) ||
      (symbol === "reduce" && parseFloat(profit) > parseFloat(money))
    ) {
      Toast.fail("请确保持有金额大于持有收益");
      return;
    }
    if (isUndefined) {
      fundInfo.push({
        fund_code: fundCode,
        fund_name: fundName,
        owned_amount: money,
        profit: `${symbol === "reduce" ? "-" : ""}${profit}`,
      });
    } else {
      fundInfo[+index] = {
        fund_code: fundCode,
        fund_name: fundName,
        owned_amount: money,
        profit: `${symbol === "reduce" ? "-" : ""}${profit}`,
      };
    }

    dispatch({
      type: "fund/setFundInfo",
      payload: fundInfo,
    });

    if (goBack === "1") {
      Taro.navigateBack();
    } else {
      Taro.redirectTo({
        url: `/packageAddFund/pages/import-hold/index?activity_id=${
          activity_id || ""
        }&schedule_id=${schedule_id || ""}`,
      });
      // Taro.redirectTo({
      //   url: "/packageAddFund/pages/import-hold/index"
      // });
    }
  };

  const toSearch = () => {
    Taro.navigateTo({
      url: "/packageAddFund/pages/search-fund/index?type=3",
      events: {
        // acceptDataFromOpenedPage
        acceptDataFromOpenedPage: function (data: {
          fund_name: string;
          fund_code: string;
        }) {
          setFundName(data.fund_name);
          setFundCode(data.fund_code);
        },
      },
    });
  };

  const valueFormat = (val: string) => {
    let _val = val.replace(/^\./g, ""); // 第一位不能为小数点
    _val = _val.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //保证.只出现一次，而不能出现两次以上
    let _val_arr = _val.split(".");
    if (_val_arr[1]?.length > 2) {
      _val = parseFloat(_val).toFixed(2);
    }
    return _val;
  };

  useLayoutEffect(() => {
    const _new = valueFormat(money);
    setMoney(_new);
  }, [money]);
  useLayoutEffect(() => {
    const _new = valueFormat(profit);
    setProfit(_new);
  }, [profit]);

  return (
    <View className="edit-fund-container">
      <View>
        <View className="input-container">
          <View className="title">基金名称</View>
          <View className="input-fund-name" onClick={toSearch}>
            <Input
              disabled
              value={fundName}
              placeholderStyle={"font-size: 28rpx; font-weight: 400"}
              placeholder="点击搜索基金"
            />
          </View>
        </View>
        <View className="input-container">
          <View className="title">持有金额</View>
          <View className="input">
            <Input
              type="digit"
              value={money}
              controlled={true}
              onInput={(e) => {
                setMoney(e.detail.value);
              }}
              maxlength={10}
              placeholderStyle={"font-size: 28rpx; font-weight: 400"}
              placeholder="请输入基金持有金额"
            />
          </View>
        </View>
        <View className="input-container">
          <View className="title">持有收益</View>
          <View
            className="symbol"
            onClick={() => {
              if (symbol === "add") {
                setSymbol("reduce");
              } else {
                setSymbol("add");
              }
            }}
          >
            <Image
              src={symbol === "add" ? addIcon : reduceIcon}
              style={{
                width: "48rpx",
                height: "48rpx",
              }}
            />
          </View>

          <View className="input">
            <Input
              type="digit"
              value={profit}
              controlled={true}
              onInput={(e) => {
                setProfit(e.detail.value);
              }}
              maxlength={10}
              placeholder="请输入基金持有收益"
              placeholderStyle={"font-size: 28rpx; font-weight: 400"}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: "40rpx",
        }}
      >
        <Button onClick={saveFund}>保存</Button>
      </View>
    </View>
  );
};

export default EditFund;
