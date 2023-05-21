/*
 * @Date: 2023-02-07 14:48:54
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-03 16:29:00
 * @FilePath: /assistant-ui/src/pages/hold/components/List/index.tsx
 * @Description:
 */

import { Image, View } from "@tarojs/components";
import React, { useCallback, useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { Tabs } from "@taroify/core";
import Table from "@/components/Table";
import HoldTotal from "../HoldTotal";
import { Toast } from "@/components/Toast";
import { listOwnFund, listOptionalFund } from "../../services";
import getOptionsCloumns from "./options_columns";
import getOwnColumns from "./own_columns";
import "@/components/less/table.less";
import { useStoreState, useStoreDispatch } from "@/hooks";
import { sendPoint } from "@/utils/sendPoint";
import EmptyList from "./EmptyList";
import GestureGuide from "../GestureGuide";
import "../../index.less";
import { tabbarHeight } from "@/config/layoutSize";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import edit from "@/assets/images/icons/edit.png";
import addCircular from "@/assets/images/icons/add-fff.png";
import {
  getLocalToken,
  getLocalUid,
  getStorage,
  setStorage,
} from "@/utils/local";
import { h5BaseURL } from "@/config";

type IDataType = {
  sum?: {
    total_assets: string; //总资产
    today_assets: string; //当日总收益
    position_income: string; //持仓收益
  };
  is_pop_out?: any; // 是否弹窗
  data: any[];
  tips?: string;
  title_date: { [propsname: string]: string };
};

// 获取所有数据
const getListData = () => {
  return Promise.all([listOptionalFund(), listOwnFund()]).then(
    ([options, own]) => {
      return {
        options,
        own,
      };
    }
  );
};
// @ts-ignore
function FundTable({ type, ...tableProps }) {
  return (
    <View
      className="tableWrap"
      style={{
        paddingBottom: (tableProps.data || []).length > 0 ? "114rpx" : "0",
        overflow: (tableProps.data || []).length > 0 ? "hiden" : "inherit",
      }}
    >
      <Table
        id={"table"}
        {...tableProps}
        columns={tableProps.columns}
        data={tableProps.data}
        rowClick={(item) => {
          if (item?.daily_level != 0) {
            const token = getLocalToken();
            const uid = getLocalUid();
            const channel = getStorage("channel");
            const did = getStorage("did");
            const url = `${h5BaseURL}fund-details/index?token=${token}&uid=${uid}&fund_code=${item.fund_code}&title=基金详情&chn=${channel}&did=${did}&type=${type}`;

            Taro.navigateTo({
              url: `/pages/fund-details/index?url=${encodeURIComponent(url)}`,
            });
          } else {
            Toast.info("该基金类型暂不支持买卖点信号");
          }
        }}
      />
    </View>
  );
}

export default function FundList() {
  const {
    global: { userType },
  } = useStoreState();
  const [renderPhoneAuthButton] = usePhoneAuthorization();

  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<{ options: IDataType; own: IDataType }>();

  const dispatch = useStoreDispatch();

  const refreshData = useCallback(() => {
    return getListData().then(({ options, own }) => {
      setData({ options, own });
      if (own?.is_pop_out != null) {
        setStorage("showOnewGuide", "true");
      }
    });
  }, []);

  useEffect(() => {
    if (userType !== "2") return;
    //修复由于请求次数过多导致前端竞态问题
    refreshData();
  }, [tabIndex, refreshData, userType]);
  useEffect(() => {
    const onHoldPageShow = () => {
      if (userType !== "2") return;
      refreshData();
    };
    let before = Date.now();
    let timer = setInterval(() => {
      let now = Date.now();
      if (now - before > 40 * 1000) {
        refreshData();
        before = now;
      }
    }, 1000);
    Taro.eventCenter.on("HoldPageShow", onHoldPageShow);
    return () => {
      timer && clearInterval(timer);
      Taro.eventCenter.off("HoldPageShow", onHoldPageShow);
    };
  }, [refreshData, userType]);

  const addFundType = tabIndex === 0 ? "3" : "1";
  const pageid = tabIndex === 0 ? "Holdingfund" : "FocusfundsFocusfunds";
  const tableData = tabIndex === 0 ? data?.own : data?.options;
  const tableId = tabIndex === 0 ? "#HoldTable" : "#OptionTable";
  const jumpEdit = () => {
    dispatch({
      type: "fund/setEditFundInfo",
      payload: tableData?.data,
    });
    Taro.navigateTo({
      url: `/packageAddFund/pages/arrange-fund/index?type=${addFundType}`,
    });
  };
  const jumpAdd = () => {
    dispatch({
      type: "global/setType",
      payload: "buySignal",
    });

    Taro.navigateTo({
      url: `/packageAddFund/pages/add-fund/index?type=${addFundType}`,
    });

    sendPoint({
      pageid: pageid,
      ts: Date.now(),
      event: "click",
    });
  };

  // 没登录显示一个假的
  if (userType !== "2") {
    return (
      <>
        <View style={{ marginTop: "32rpx" }}>
          <Image
            style={{ width: "100%" }}
            src="https://static.licaimofang.com/wp-content/uploads/2023/03/un_login_hold_2-1.png"
            mode="widthFix"
            className="mask"
          />
          {renderPhoneAuthButton()}
        </View>
      </>
    );
  }

  // 登录的情况
  return (
    <>
      {/* 边距填充，因为table没法view包裹起来 */}
      <View style={{ height: "32rpx", width: "100%" }} />

      <Tabs
        value={tabIndex}
        onChange={setTabIndex}
        style="--tabs-line-background-color:#121D3A"
      >
        <Tabs.TabPane title={`持有基金(${data?.own?.data?.length ?? 0})`} />
        <Tabs.TabPane title={`关注基金(${data?.options?.data?.length ?? 0})`} />
      </Tabs>

      <View className="hairLine" />

      {/* 总资产 */}
      {tabIndex === 0 && <HoldTotal assetInfo={data?.own?.sum} />}

      {/* 持有列表 */}
      {tabIndex === 0 && (
        <FundTable
          id="HoldTable"
          type={0}
          tips={data?.own?.tips}
          columns={getOwnColumns(data?.own?.title_date ?? [])}
          data={data?.own?.data ?? []}
          style={{
            zIndex: 2,
            flexShrink: 0,
            flexGrow: 1,
          }}
          refresh={true}
          onRefresherRefresh={() => refreshData()}
        />
      )}

      {/* 关注列表 */}
      {tabIndex === 1 && (
        <FundTable
          id="OptionTable"
          type={1}
          columns={getOptionsCloumns(data?.options?.title_date ?? [])}
          data={data?.options?.data ?? []}
          style={{
            zIndex: 2,
            flexShrink: 0,
            flexGrow: 1,
          }}
          refresh={true}
          onRefresherRefresh={() => refreshData()}
        />
      )}

      {/* 引导页 */}
      {tabIndex === 0 && <GestureGuide bindTableId={tableId} />}

      {/* 编辑、导入按钮 */}
      {(tableData?.data?.length ?? 0) > 0 && (
        <View className="floatBottom" style={{ bottom: tabbarHeight }}>
          <View className="edit-btn-container">
            <View className="app-flex-center btn" onClick={jumpEdit}>
              <Image src={edit} />
              编辑基金
            </View>
            <View
              className="app-flex-center btn"
              style={{
                padding: "16rpx 32rpx 16rpx 0",
                flex: "1.1",
              }}
              onClick={jumpAdd}
            >
              <View className="app-flex-center blue-btn">
                <Image src={addCircular} />
                导入基金
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 列表为空时填充 */}
      {(tableData?.data?.length ?? 0) === 0 && (
        <EmptyList onAdd={jumpAdd} type={tabIndex} />
      )}
    </>
  );
}
