import { ScrollView, View } from "@tarojs/components";
import React, { FC, useEffect, useState } from "react";

import "./index.less";
import Taro, { getCurrentPages, useDidShow } from "@tarojs/taro";
import ImportItem from "@/packageAddFund/components/ImportItem";
import Button from "@/components/Button";
import { useStoreState } from "@/hooks";
import { Toast } from "@/components/Toast";
import { addFund } from "./services";

const ImportOptional: FC = () => {
  const {
    fund: { fundInfo },
    global,
  } = useStoreState();

  const [fund, setFund] = useState<
    {
      fund_name: string; //基金名称
      fund_code: string;
      select: boolean;
    }[]
  >([]);
  const [selectLen, setSelectLen] = useState<number>(0);

  const onChangeSelect = (index: string | number, select: any) => {
    let _fund = JSON.parse(JSON.stringify(fund));
    _fund[index].select = select;
    setFund(_fund);
  };

  const importOptional = async () => {
    const selectFunds = fund.reduce((prev: string[], next) => {
      let _res = prev;
      if (next.select) {
        _res.push(next.fund_code);
        return _res;
      } else {
        return prev;
      }
    }, []);

    if (selectFunds.length === 0) {
      Toast.fail("请至少选择一支基金");
    } else {
      Taro.showLoading({
        title: "加载中...",
      });
      try {
        // @ts-ignore
        const res = await addFund({
          optional_code: selectFunds,
          upload_fund_page: global.type,
        });
        // 0: 未关注; 1: 已关注;
        if (res.is_care == "1") {
          // 已经关注公众号
          const pages = getCurrentPages();

          let _router = "";

          pages.map((item) => {
            if (item.route === "pages/hold/index") {
              _router = "hold";
            }
            if (item.route === "pages/fund-diagnosis/index") {
              _router = "fund-diagnosis";
            }
            if (item.route === "pages/buy-sell-signal/index") {
              _router = "buy-sell-signal";
            }
          });

          if (_router === "fund-diagnosis") {
            Taro.switchTab({
              url: "/pages/fund-diagnosis/index",
            });
          } else if (_router == "buy-sell-signal") {
            Taro.switchTab({
              url: "/pages/buy-sell-signal/index",
            });
          } else {
            Taro.switchTab({
              url: "/pages/hold/index",
            });
          }
          // Taro.switchTab({
          //   url: "/pages/optional/index"
          // });
        } else {
          Taro.redirectTo({
            url: "/packagePage/pages/follow-official-account/index",
          });
        }
      } catch (error) {}
      Taro.hideLoading();
    }
  };

  useDidShow(() => {});
  useEffect(() => {
    const _fund = fundInfo?.map((item) => {
      return {
        ...item,
        select: true,
      };
    });

    setFund(_fund);
  }, [fundInfo]);

  useEffect(() => {
    const _len = fund.reduce((prev, next) => {
      if (next.select) {
        return ++prev;
      } else {
        return prev;
      }
    }, 0);
    setSelectLen(_len);
  }, [fund]);

  return (
    <ScrollView className="import-optional-container" scrollY>
      {fund.map((item, index) => {
        return (
          <ImportItem
            onChangeSelect={onChangeSelect}
            index={index}
            data={item}
          />
        );
      })}
      <View
        style={{
          marginTop: "40rpx",
        }}
      >
        <Button onClick={importOptional}>
          确定导入（已选{selectLen}/{fund.length}）
        </Button>
      </View>
    </ScrollView>
  );
};

export default ImportOptional;
