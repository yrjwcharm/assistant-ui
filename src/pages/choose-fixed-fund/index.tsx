import { View, Image, Text } from "@tarojs/components";
import React, { FC, useCallback, useEffect, useState } from "react";

import Taro, { getCurrentPages, useDidShow } from "@tarojs/taro";
import { useStoreState } from "@/hooks";
import { sendPoint } from "@/utils/sendPoint";
import CustomTabBar from "@/components/CustomTabBar";
import "./index.less";
import { getStorage, removeStorage, setStorage } from "@/utils/local";
import searchIcon from "@/assets/images/icons/search.png";
import { TableDataType } from "@/pages/fund-diagnosis/columns";
import { defaultInfo, listDiagnoseFund } from "@/pages/fund-diagnosis/services";
import TabDiagnosis from "@/pages/fund-diagnosis/components/TabDiagnosis";
import { callRecommendFundApi } from "@/pages/choose-fixed-fund/services";
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
  const [showGuide, setShowGuide] = useState<boolean>(false); // 示例基金说明蒙层显示隐藏
  const [recommendList, setRecommendLit] = useState([]);
  const [activeKey, setActiveKey] = useState<"hold" | "optional" | "recommend">(
    "hold"
  );

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
    // @ts-ignore
    const { isRecommend } = Taro.getCurrentInstance().router?.params;
    isRecommend == 1 && setActiveKey("recommend");
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
  const init = useCallback(() => {
    (async () => {
      const res = await callRecommendFundApi();
      setRecommendLit(res["recommend"]);
    })();
  }, []);
  useEffect(() => {
    init();
  }, [init]);
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
            <View
              className={`tab ${
                activeKey === "recommend" ? "active-tab" : ""
              } `}
              onClick={() => {
                setActiveKey("recommend");
              }}
            >
              牛人推荐
            </View>
          </View>
          <View className="tab-content-container">
            {(activeKey === "hold" || activeKey == "optional") && (
              <TabDiagnosis
                data={activeKey === "hold" ? tableHoldData : tableOptionalData}
                activeKey={activeKey}
                isDiagnosis={false}
                showGuide={showGuide}
                closeGuide={closeGuide}
              />
            )}
            {activeKey === "recommend" && (
              <View style={{ paddingBottom: !isIPhoneX() ? "17PX" : "34PX" }}>
                {recommendList.map((el, index) => {
                  return (
                    <View
                      className="list_row_recommend"
                      onClick={() => {
                        Taro.eventCenter.trigger("trigger", el);
                        Taro.navigateBack({
                          delta: 1,
                        });
                      }}
                    >
                      <View className="list_row_wrap">
                        <View className="left">
                          <Text className="title">{el["fund_name"]}</Text>
                          <Text className="percent">{el["ratio_change"]}</Text>
                          <Text className="profit_rate">近一年收益率</Text>
                        </View>
                        <View className="right">
                          <Image
                            src={
                              el["estimation_level"] == 1
                                ? require("@assets/images/low.png")
                                : el["estimation_level"] == 5
                                ? require("@assets/images/high.png")
                                : require("@assets/images/normal.png")
                            }
                            className="separator_img"
                          />
                          <View className="status_view">
                            <Text className="status_text">
                              跟踪指数基金估值
                            </Text>
                            <Text className="status">
                              {el["estimation_level"] == 1
                                ? "低估"
                                : el["estimation_level"] == 5
                                ? "高估"
                                : "正常"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
      <View
        className="bottom_tabbar"
        style={{ bottom: !isIPhoneX() ? 0 : "17PX" }}
      >
        <CustomTabBar path="pages/fixed-housekeeper/index" />
      </View>
    </View>
  );
};

export default FundDiagnosis;
