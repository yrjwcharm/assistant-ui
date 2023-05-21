import { ScrollView, View } from "@tarojs/components";
import React, { FC } from "react";

import "./index.less";
import Taro, { getCurrentPages, useRouter } from "@tarojs/taro";
import Button from "@/components/Button";
import ImportHoldItem from "@/packageAddFund/components/ImportHoldItem";
import { useStoreState } from "@/hooks";
import { addFund, inputFundInfo } from "./services";
import { Toast } from "@/components/Toast";
import { sendPoint } from "@/utils/sendPoint";

const ImportHold: FC = () => {
  const {
    fund: { fundInfo },
    global: { type },
  } = useStoreState();
  const router = useRouter();
  const { activity_id, schedule_id } = router.params as {
    activity_id?: string | undefined; // 活动id;
    schedule_id?: string | undefined; // 期数id
  };
  const save = async () => {
    Taro.showLoading({
      title: "加载中...",
    });
    let status = true; // 是否通过验证
    for (let index = 0; index < fundInfo.length; index++) {
      if (
        fundInfo[index].owned_amount === "" ||
        fundInfo[index].profit === ""
      ) {
        // 数据为空
        status = false;
        Toast.fail("你上传的基金持有金额/持有收益数据未填写完整");
        break;
      }
      // @ts-ignore
      if (parseFloat(fundInfo[index].owned_amount) === 0) {
        status = false;
        Toast.fail("持有金额填写数额需要大于0");
        break;
      }
    }

    if (status) {
      try {
        if (activity_id && schedule_id) {
          const res = await inputFundInfo({
            activity_id,
            schedule_id,
            fund_data: fundInfo,
          });
          Taro.hideLoading();
          // 0: 未关注; 1: 已关注;
          Toast.info("报名成功");
          setTimeout(() => {
            if (res.is_care == "1") {
              // 已经关注公众号=>跳转排名
              // Taro.switchTab({
              //   url: "/pages/hold/index"
              // });
              Taro.redirectTo({
                url: `/packageActivity/pages/match-ranking-list/index?activity_id=${activity_id}&schedule_id=${schedule_id}`,
              });
            } else {
              Taro.redirectTo({
                url: "/packagePage/pages/follow-official-account/index",
              });
            }
          }, 1000);
        } else {
          const res = await addFund({
            upload_fund_page: type,
            fund_data: fundInfo,
          });
          Taro.hideLoading();
          // 0: 未关注; 1: 已关注;
          if (res.is_care == "1") {
            // 已经关注公众号
            // Taro.switchTab({
            //   url: "/pages/hold/index"
            // });
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
                url: "/pages/fund-diagnosis/index?defaultTab=optional",
              });
            } else if (_router === "buy-sell-signal") {
              Taro.switchTab({
                url: "/pages/buy-sell-signal/index",
              });
            } else {
              Taro.switchTab({
                url: "/pages/hold/index",
              });
            }
          } else {
            Taro.redirectTo({
              url: "/packagePage/pages/follow-official-account/index",
            });
          }
        }

        sendPoint({
          ts: Date.now(),
          event: "importregister",
        });
      } catch (error) {}
    }
  };
  return (
    <View className="import-hold-container">
      <ScrollView className="import-hold-content" scrollY>
        <View className="content">
          {fundInfo?.map((item, index) => {
            return <ImportHoldItem index={index} data={item} />;
          })}
        </View>
      </ScrollView>
      <View className="btn-container">
        <View
          style={{
            marginRight: "12rpx",
            flex: 1,
          }}
        >
          <Button
            type="ghost"
            onClick={() => {
              Taro.navigateTo({
                url: `/packageAddFund/pages/edit-fund/index?goBack=1&activity_id=${
                  activity_id || ""
                }&schedule_id=${schedule_id || ""}`,
              });
            }}
          >
            手动输入添加持仓
          </Button>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Button onClick={save}>确认导入</Button>
        </View>
      </View>
    </View>
  );
};

export default ImportHold;
