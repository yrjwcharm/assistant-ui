import { View, Image, Text } from "@tarojs/components";
import React, { FC, useEffect, useState } from "react";

import Taro, { getCurrentPages, useDidShow } from "@tarojs/taro";
import { TableDataType } from "./columns";
import { useStoreState } from "@/hooks";
import { listDiagnoseFund, defaultInfo } from "./services";
import { sendPoint } from "@/utils/sendPoint";
import CustomTabBar from "@/components/CustomTabBar";
import TabDiagnosis from "./components/TabDiagnosis";
import "./index.less";
import { getStorage, removeStorage, setStorage } from "@/utils/local";
import searchIcon from "@/assets/images/icons/search.png";
import { isIPhoneX } from "@/utils/device";
let didShowDo: boolean = false;

const pageid: string = "Funddiagnosishomepage";
let ts_in: number = 0;

const FundDiagnosis: FC = () => {
  const {
    global: { userType },
  } = useStoreState();

  const [tableHoldData, setTableHoldData] = useState<TableDataType[]>([]);
  const [tableOptionalData, setTableOptionalData] = useState<TableDataType[]>(
    []
  );
  // const [titleDate, setTitleDate] = useState<Record<string, string>>({});
  const [showGuide, setShowGuide] = useState<boolean>(false); // 示例基金说明蒙层显示隐藏
  const [activeKey, setActiveKey] = useState<"hold" | "optional">("hold");

  const getListDiagnoseFund = async () => {
    try {
      const res = await listDiagnoseFund({
        list_type: activeKey === "hold" ? 2 : 1, // 消息类型 1: 自选; 2: 持有;
      });
      if (activeKey === "hold") {
        setTableHoldData(res.list || []);
      } else {
        setTableOptionalData(res.list || []);
      }

      const _is_pop_out = getStorage("diagnosis_is_pop_out");
      if ((!_is_pop_out && res?.is_pop_out) || _is_pop_out === "1") {
        setStorage("diagnosis_is_pop_out", "1");
        setShowGuide(true);
      }
      // setTitleDate(res?.title_date || {});
    } catch (error) {}
    Taro.hideLoading();
    didShowDo = false;
  };

  useEffect(() => {
    Taro.showLoading({
      title: "加载中...",
    });
    if (userType === "2" && !didShowDo) {
      getListDiagnoseFund();
    } else {
      Taro.hideLoading();
    }
    if (userType !== "2") {
      clearData();
    }
  }, [userType]);

  useEffect(() => {
    if (userType === "2") {
      getListDiagnoseFund();
    }
  }, [activeKey]);

  useDidShow(() => {
    // Taro.hideTabBarRedDot({
    //   index: 1
    // });
    if (userType === "2") {
      didShowDo = true;
      getListDiagnoseFund();
    }
    if (getStorage("web-diagnostic-report")) {
      removeStorage("web-diagnostic-report");
    }
    log();
  });

  const getDefaultInfo = async () => {
    try {
      await defaultInfo();
    } catch (error) {}
  };

  useEffect(() => {
    getDefaultInfo();
  }, []);

  const clearData = () => {
    // setTableData([]);
    // setTitleDate({});
  };
  const log = () => {
    const pages = getCurrentPages();
    const current = pages[pages.length - 1];
    if (current.route === "pages/fund-diagnosis/index") {
      ts_in = Date.now();
      sendPoint({
        pageid: pageid,
        ts: ts_in,
        event: "load",
      });
    }
  };

  const closeGuide = () => {
    removeStorage("diagnosis_is_pop_out");
    setShowGuide(false);
  };
  // if (userType === "2") {
  return (
    <View className="fund-diagnosis-container">
      {/*<HomeNavNav nohead={true} title="基金理财助手" />*/}
      <View
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            padding: "16rpx 32rpx",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            className="optional-search-c"
            style={{ flex: 1, marginRight: "11PX" }}
            onClick={() => {
              Taro.navigateTo({
                url: "/packageAddFund/pages/search-fund/index?type=1",
              });
            }}
          >
            <View className="search-icon">
              <Image src={searchIcon} />
            </View>
            <View className="input">搜索基金名称/基金代码</View>
          </View>
          <Text
            style={{
              fontSize: "14PX",
              fontFamily: "PingFangSC-Regular",
              color: "#545968",
            }}
          >
            搜索
          </Text>
        </View>
        <View style={{ height: "20PX", background: "#f5f6f8" }} />
        <View className="tab-container">
          <View className="tab-bar">
            <View
              className={`tab ${activeKey === "hold" ? "active-tab" : ""} `}
              onClick={() => {
                setActiveKey("hold");
              }}
            >
              我的持有
            </View>
            <View
              className={`tab ${activeKey === "optional" ? "active-tab" : ""} `}
              onClick={() => {
                setActiveKey("optional");
              }}
            >
              我的关注
            </View>
          </View>
          <View className="tab-content-container">
            <TabDiagnosis
              data={activeKey === "hold" ? tableHoldData : tableOptionalData}
              activeKey={activeKey}
              showGuide={showGuide}
              closeGuide={closeGuide}
              isDiagnosis={true}
            />
          </View>
        </View>
      </View>
      <View
        className="bottom_tabbar"
        style={{ bottom: !isIPhoneX() ? 0 : "17PX" }}
      >
        <CustomTabBar path="pages/fund-diagnosis-intro/index" />
      </View>
    </View>
  );
};

export default FundDiagnosis;
