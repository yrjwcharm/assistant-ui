import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Input,
  Swiper,
  SwiperItem,
  Slider,
} from "@tarojs/components";
import CustomTabBar from "@/components/CustomTabBar";
import "./index.less";
import HomeNavNav from "@/components/HomeNav";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import CommonModal from "@/components/CommonModal";
import {
  callFixedPlanList,
  callGetFixInfo,
} from "@/pages/fixed-housekeeper/services";
import { updateType } from "@/utils/getUserInfo";
import { sendPoint } from "@/utils/sendPoint";
import { useStoreState } from "@/hooks";
import { defaultshareInfo } from "@/config/variables";
import { h5BaseURL } from "@/config";
import { isIPhoneX } from "@/utils/device";
import { callInviteCard } from "@/pages/web-signal-details/services";
import DefaultGraph from "@/components/DefaultGraph";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import LoadingTip from "@/components/Loading/Loading";
const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight;
const FixedHousekeeper = () => {
  const {
    global: { userType },
  } = useStoreState();
  const [renderPhoneAuthButton] = usePhoneAuthorization({
    afterLoginCb: () => {
      initPlanList();
    },
  });
  const [investPlanId] = useState(0);
  const [fixedPlanList, setFixedPlanList] = useState([]);
  const [fixedMoney, setFixedMoney] = useState(1000);
  const [percent, setPercent] = useState(30);
  const [tab1Active, setTab1Active] = useState(true);
  const [tab2Active, setTab2Active] = useState(false);
  const [fixDuration, setFixDuration] = useState("y1");
  const [fixPeriod, setFixPeriod] = useState("1d");
  const [fixDurationList, setFixDurationList] = useState<
    { key: string; value: string; isActive: boolean }[]
  >([]);
  const [fixedWeekList, setFixWeekList] = useState<any>([]);
  const [isMember, setIsMember] = useState(false);
  const [fixedStrategyList, setFixedStrategyList] = useState([
    {
      title: "普通定投",
      isActive: true,
      subtitle: "震荡环境优选",
    },
    {
      title: "目标止盈",
      isActive: false,
      subtitle: "上涨环境优选",
    },
  ]);
  const [fund, setFund] = useState<any>({});
  const [popImgList, setPopImgList] = useState([]);
  const [isPopOut, setIsPopOut] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [showGuide3, setShowGuide3] = useState(false);
  const [showGuide4, setShowGuide4] = useState(false);
  const [isOrdinaryFixed, setIsOrdinaryFixed] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [loading, setLoading] = useState(true);

  const tabLeftClick = () => {
    setTab1Active(true);
    setTab2Active(false);
  };
  const tabRightClick = async () => {
    if (userType == "2" && !isMember) {
      sendPoint({
        pageid: "Purchaseguide",
        // ts: ts_in_app,
        ts: Date.now(),
        event: "load",
      });
      setShowGuide4(true);
      return;
    }
    setTab1Active(false);
    setTab2Active(true);
  };
  useDidShow(() => {
    userType == "2" && initPlanList();
  });
  const initPlanList = async () => {
    const res = await callFixedPlanList({
      uid: Taro.getStorageSync("uid"),
    });
    if (res.list.length > 0) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true);
    }
    setIsMember(res.is_member);
    setFixedPlanList(res.list);
  };
  // @ts-ignore
  useShareAppMessage(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/fixed-housekeeper/index" + path);
  });

  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/fixed-housekeeper/index" + path);
  });
  const init = useCallback(() => {
    (async () => {
      const res = await callGetFixInfo();
      const {
        invest_duration = {},
        invest_period = {},
        is_pop_out = false,
        pop_img = [],
      } = res;
      let investDurationList: any = Object.entries(invest_duration).map(
        (el, index) => {
          return { key: el[0], value: el[1], isActive: index == 0 };
        }
      );
      let investPeriodList: any = Object.entries(invest_period).map(
        (el, index) => {
          return { key: el[0], value: el[1], isActive: index == 0 };
        }
      );
      setFixDurationList(investDurationList);
      setFixWeekList(investPeriodList);
      setPopImgList(pop_img);
      setIsPopOut(is_pop_out);
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    init();
  }, [init]);
  useEffect(() => {
    Taro.eventCenter.on("trigger", (fund) => {
      setFund(fund);
    });
    return () => {
      Taro.eventCenter.off("trigger");
    };
  }, []);

  const selFixDuration = (item: any) => {
    fixDurationList.map((el) => {
      el.isActive = false;
      if (JSON.stringify(el) == JSON.stringify(item)) {
        el.isActive = true;
      }
    });
    setFixDurationList([...fixDurationList]);
    setFixDuration(item["key"]);
  };
  const selFixWeek = (item: { [x: string]: React.SetStateAction<string> }) => {
    fixedWeekList?.map((el: any) => {
      el.isActive = false;
      if (JSON.stringify(el) == JSON.stringify(item)) {
        el.isActive = true;
      }
    });
    setFixPeriod(item["key"]);
    setFixWeekList([...fixedWeekList]);
  };
  const selFixedStrategy = (item: any, index: number) => {
    fixedStrategyList.map((el) => {
      el.isActive = false;
      if (JSON.stringify(el) == JSON.stringify(item)) {
        el.isActive = true;
      }
    });
    index == 0 ? setIsOrdinaryFixed(true) : setIsOrdinaryFixed(false);
    setFixedStrategyList([...fixedStrategyList]);
  };
  const onSlidChange = (e: {
    detail: { value: React.SetStateAction<number> };
  }) => {
    setFixedMoney(e.detail.value);
  };
  const onSlidChange1 = (e: {
    detail: { value: React.SetStateAction<number> };
  }) => {
    setPercent(e.detail.value);
  };
  return (
    <>
      {loading ? (
        <LoadingTip />
      ) : (
        <View className="fix-invest">
          <View className="fixed_nav">
            <HomeNavNav nohead={true} title="基金理财助手" />
          </View>
          <View
            className="content"
            style={{
              paddingTop: (statusBarHeight as number) + 44,
            }}
          >
            <View
              className="header"
              style={{
                background: `url('https://static.licaimofang.com/wp-content/uploads/2022/12/assistant-InvestPlanBannerImg-1.png') no-repeat`,
                backgroundSize: "cover",
              }}
            >
              <View className="tab_card">
                <View className="tab_wrap">
                  <View
                    className={
                      tab1Active ? "tab_left tab_left_active" : "tab_left"
                    }
                    onClick={tabLeftClick}
                  >
                    <View className="tab_content">
                      <View className="tab_wrapper">
                        <Text
                          className="tab_title"
                          style={
                            tab1Active
                              ? {
                                  color: "#0051CC",
                                  fontFamily: "PingFangSC-Semibold",
                                }
                              : {
                                  color: "#545968",
                                  fontFamily: "PingFangSC-Medium",
                                }
                          }
                        >
                          制定定投计划
                        </Text>
                        <View
                          className={"bottom_separator"}
                          style={
                            tab1Active
                              ? { background: "#0051CC" }
                              : { background: "transparent" }
                          }
                        />
                      </View>
                    </View>
                    {tab1Active && (
                      <Image
                        src={require("@assets/images/tab_left.png")}
                        className="image"
                      />
                    )}
                  </View>
                  <View
                    className={
                      tab2Active ? "tab_right tab_right_active" : "tab_right"
                    }
                    onClick={tabRightClick}
                  >
                    <View className="tab_content">
                      <View className="tab_wrapper">
                        <Text
                          className="tab_title"
                          style={
                            tab2Active
                              ? {
                                  color: "#0051CC",
                                  fontFamily: "PingFangSC-Semibold",
                                }
                              : {
                                  color: "#545968",
                                  fontFamily: "PingFangSC-Medium",
                                }
                          }
                        >
                          我的定投计划
                        </Text>
                        <View
                          className="bottom_separator"
                          style={
                            tab2Active
                              ? { background: "#0051CC" }
                              : { background: "transparent" }
                          }
                        />
                      </View>
                    </View>
                    {tab2Active && (
                      <Image
                        src={require("@assets/images/tab_right.png")}
                        className="image"
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
            {tab1Active && (
              <View className="section_wrap">
                <View className="choice_fund">
                  {userType !== "2" ? renderPhoneAuthButton() : ""}
                  <View className="choice_header">
                    <Text className="title">选择基金</Text>
                    <View
                      className="right_wrap"
                      onClick={() => {
                        updateType("fundInvestPlan");
                        Taro.navigateTo({
                          url: `/pages/choose-fixed-fund/index?isRecommend=1`,
                        });
                      }}
                    >
                      <Image
                        src={require("@assets/images/ask.png")}
                        className="ask"
                      />
                      <Text className="title">什么基金适合定投？</Text>
                    </View>
                  </View>
                  <View
                    className="choice_footer"
                    onClick={() => {
                      updateType("fundInvestPlan");
                      Taro.navigateTo({
                        url: "/pages/choose-fixed-fund/index",
                      });
                    }}
                  >
                    <View className="choice_wrap">
                      {Object.keys(fund).length != 0 && (
                        <Text className="name">{fund?.["fund_name"]}</Text>
                      )}
                      {Object.keys(fund).length == 0 && (
                        <Input
                          className="input"
                          placeholderClass="placeholderClass"
                          placeholder="请选择基金"
                          disabled={true}
                        />
                      )}
                      <Image
                        src={require("@assets/images/forward.png")}
                        className="arrow"
                      />
                    </View>
                  </View>
                </View>
                <View className="fixed_money">
                  <View className="fixed_header">
                    <Text className="title">定投金额(元)</Text>
                    <View
                      className="right_wrap"
                      onClick={() => {
                        Taro.showModal({
                          content: `根据工资比例法，一般定投金额可以设定在每月月薪10%-20%。`,
                          showCancel: false,
                          confirmColor: "#0051CC",
                        });
                      }}
                    >
                      <Image
                        src={require("@assets/images/ask.png")}
                        className="ask"
                      />
                      <Text className="title">每次定投多少钱合适？</Text>
                    </View>
                  </View>

                  <View className="flex" style="flex-wrap:wrap;margin-top:16PX">
                    <View className="money_wrap">
                      <Text className="money_value">{fixedMoney}</Text>
                    </View>
                    <Slider
                      activeColor="#0051CC"
                      onChange={(e) => {
                        setFixedMoney(e.detail.value);
                      }}
                      onChanging={onSlidChange}
                      step={100}
                      value={fixedMoney}
                      showValue
                      min={0}
                      max={10000}
                    />
                  </View>
                </View>
                <View className="fixed_duration">
                  <View className="fixed_duration_header">
                    <Text className="title">定投时长</Text>
                    <View
                      className="right_wrap"
                      onClick={() => {
                        Taro.showModal({
                          content: `A股一轮完整的牛熊周期走势在3~10年，建议定投时间至少1年，推荐定投时间3年以上。`,
                          showCancel: false,
                          confirmColor: "#0051CC",
                        });
                      }}
                    >
                      <Image
                        src={require("@assets/images/ask.png")}
                        className="ask"
                      />
                      <Text className="title">建议定投多久？</Text>
                    </View>
                  </View>
                  <View className="list_row">
                    {fixDurationList.map((el, index) => {
                      return (
                        <View
                          key={el + `` + index}
                          className="list_row_item"
                          onClick={() => selFixDuration(el)}
                          style={{
                            background: el.isActive ? "#D4E5FF" : "#F5F6F8",
                          }}
                        >
                          <Text
                            style={{
                              color: el.isActive ? "#0046B1" : "#545968",
                              fontFamily: el.isActive
                                ? "PingFangSC-Medium"
                                : "PingFangSC-Regular",
                            }}
                          >
                            {el.value}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <View className="fixed_duration">
                  <View className="fixed_duration_header">
                    <Text className="title">定投周期</Text>
                  </View>
                  <View className="list_row">
                    {fixedWeekList?.map((el: any, index: number) => {
                      return (
                        <View
                          key={el + `` + index}
                          onClick={() => selFixWeek(el)}
                          className="list_row_item"
                          style={{
                            background: el.isActive ? "#D4E5FF" : "#F5F6F8",
                          }}
                        >
                          <Text
                            style={{
                              color: el.isActive ? "#0046B1" : "#545968",
                              fontFamily: el.isActive
                                ? "PingFangSC-Medium"
                                : "PingFangSC-Regular",
                            }}
                          >
                            {el.value}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View className="fixed_strategy">
                  <View className="fixed_strategy_header">
                    <Text className="title">定投策略</Text>
                  </View>
                  <View className="list_row">
                    {fixedStrategyList.map((el, index) => {
                      return (
                        <View
                          className="list_row_item"
                          onClick={() => selFixedStrategy(el, index)}
                          style={{
                            background: el.isActive ? "#D4E5FF" : "#f5f6f8",
                            marginRight: index == 0 ? "11PX" : 0,
                          }}
                        >
                          <Text
                            className="title"
                            style={{
                              color: el.isActive ? "#0051CC" : "#545968",
                            }}
                          >
                            {el.title}
                          </Text>
                          <Text
                            className="subtitle"
                            style={{
                              color: el.isActive ? "#0051CC" : "#9AA0B1",
                            }}
                          >
                            {el.subtitle}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  {!isOrdinaryFixed && (
                    <View
                      className="flex"
                      style="flex-wrap:wrap;margin-top:12PX"
                    >
                      <View className="money_wrap">
                        <Text className="money_value">{percent + "%"}</Text>
                      </View>
                      <Slider
                        activeColor="#0051CC"
                        onChange={(e) => {
                          setPercent(e.detail.value);
                        }}
                        onChanging={onSlidChange1}
                        step={1}
                        value={percent}
                        showValue
                        min={0}
                        max={100}
                      />
                    </View>
                  )}
                </View>
                <View
                  className="calc_btn"
                  style={{
                    marginBottom: Taro.getStorageSync("isIphoneX")
                      ? "112PX"
                      : "95PX",
                  }}
                  onClick={async () => {
                    if (userType !== "2") {
                      return;
                    }
                    if (Object.keys(fund).length == 0) {
                      Taro.showToast({
                        title: "您还没有选择定投的基金",
                        icon: "none",
                        duration: 3500,
                      });
                      return;
                    }
                    if (!isMember) {
                      setShowGuide4(true);
                      sendPoint({
                        pageid: "Purchaseguide",
                        // ts: ts_in_app,
                        ts: Date.now(),
                        event: "load",
                      });
                    } else {
                      if (fixedMoney < 1) {
                        Taro.showToast({
                          title: "定投金额区间在1~10000",
                          icon: "none",
                          duration: 3500,
                        });
                        return;
                      }
                      if (!isOrdinaryFixed) {
                        if (percent < 1) {
                          Taro.showToast({
                            title: "目标止盈区间在1~100%",
                            icon: "none",
                            duration: 3500,
                          });
                          return;
                        }
                      }
                      const uid = Taro.getStorageSync("uid");
                      const token = Taro.getStorageSync("token");
                      const channel = Taro.getStorageSync("channel");
                      let url =
                        h5BaseURL +
                        `fixed-plan-detail?token=${token}&chn=${channel}&uid=${uid}&fund_code=${
                          fund["fund_code"]
                        }&fund_name=${
                          fund["fund_name"]
                        }&invest_plan_id=${investPlanId}&stop_profit=${
                          isOrdinaryFixed ? 0 : percent / 100
                        }&fix_invest_money=${fixedMoney}&invest_period=${fixPeriod}&invest_duration=${fixDuration}`;
                      Taro.navigateTo({
                        url: `/pages/web-view/index?url=${encodeURIComponent(
                          url
                        )}`,
                      });
                    }
                  }}
                >
                  <Text>开始测算定投收益</Text>
                  {userType !== "2" ? renderPhoneAuthButton() : ""}
                </View>
              </View>
            )}

            {tab2Active && (
              <View
                className="section_wrap"
                style={{ paddingBottom: !isIPhoneX() ? "84PX" : "67PX" }}
              >
                {!isEmpty && fixedPlanList.length > 0 ? (
                  fixedPlanList?.map((el) => {
                    return (
                      <View
                        className="fixed_plan_list"
                        onClick={() => {
                          const uid = Taro.getStorageSync("uid");
                          const token = Taro.getStorageSync("token");
                          const channel = Taro.getStorageSync("channel");
                          let url =
                            h5BaseURL +
                            `my-plan-detail?token=${token}&chn=${channel}&uid=${uid}&fund_code=${
                              el["ass_fund_code"]
                            }&invest_plan_id=${el["id"] ?? 0}`;
                          Taro.navigateTo({
                            url: `/pages/web-view/index?url=${encodeURIComponent(
                              url
                            )}`,
                          });
                        }}
                      >
                        <View className="fixed_plan_header">
                          <View className="fixed_header_wrap">
                            <Text
                              style={{
                                color:
                                  el["ass_sub_status"] == 2
                                    ? "#9AA0B1"
                                    : "#121D3A",
                              }}
                            >
                              {el["ass_fund_name"]}
                            </Text>
                            <View
                              className="status"
                              style={{
                                backgroundColor:
                                  el["ass_sub_status"] == 2
                                    ? "#E9EAEF"
                                    : "#FFF2F2",
                              }}
                            >
                              <Text
                                style={{
                                  color:
                                    el["ass_sub_status"] == 2
                                      ? "#9AA0B1"
                                      : "#E74949",
                                }}
                              >
                                {el["ass_sub_status"] == 0
                                  ? "未订阅"
                                  : el["ass_sub_status"] == 1
                                  ? "订阅中"
                                  : el["ass_sub_status"] == 2
                                  ? "已取消"
                                  : "订阅结束"}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View className="fixed_plan_footer">
                          <View className="list_item">
                            <Text className="label">定投频率</Text>
                            <Text
                              className="value"
                              style={{
                                color:
                                  el["ass_sub_status"] == 2
                                    ? "#9AA0B1"
                                    : "#121D3A",
                              }}
                            >
                              {el["ass_invest_period_type"] == "1d"
                                ? "每天"
                                : el["ass_invest_period_type"] == "1m"
                                ? "每月1日"
                                : el["ass_invest_period_type"] == "1w"
                                ? "每周一"
                                : "每双周一"}
                            </Text>
                          </View>
                          <View className="list_item">
                            <Text className="label">定投金额(元)</Text>
                            <Text
                              className="value"
                              style={{
                                color:
                                  el["ass_sub_status"] == 2
                                    ? "#9AA0B1"
                                    : "#121D3A",
                              }}
                            >
                              {el["ass_fix_invest_money"]}
                            </Text>
                          </View>
                          <View className="list_item">
                            <Text className="label">已投期数</Text>
                            <Text
                              className="value"
                              style={{
                                color:
                                  el["ass_sub_status"] == 2
                                    ? "#9AA0B1"
                                    : "#121D3A",
                              }}
                            >
                              {el["ass_have_invest_nums"]}
                            </Text>
                          </View>
                          <View className="list_item">
                            <Text className="label">总收益率</Text>
                            <Text
                              className="value"
                              style={{
                                color:
                                  el["ass_sub_status"] == 2
                                    ? "#9AA0B1"
                                    : "#121D3A",
                              }}
                            >
                              {(el["ass_yield_rate"] * 100).toFixed(2) + "%"}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <View className="emptyData">
                    <DefaultGraph title="暂无数据" />
                  </View>
                )}
              </View>
            )}
          </View>
          {isPopOut && showGuide && (
            <View className="fixed_modal_1">
              <View className="swiper">
                <Image
                  src={require("@assets/images/close_circle.png")}
                  onClick={() => {
                    setShowGuide(false);
                  }}
                  className="close_circle"
                />
                <Swiper className="swiper_carousel" style={{ height: "350PX" }}>
                  <SwiperItem>
                    <View className="modal1">
                      <Image src={popImgList[0]} className="img" />
                    </View>
                  </SwiperItem>
                  <SwiperItem>
                    <View className="modal1">
                      <Image src={popImgList[1]} className="img" />
                      <View
                        className="modal1_btn"
                        onClick={() => {
                          setShowGuide(false);
                        }}
                      >
                        <Text>马上使用</Text>
                      </View>
                    </View>
                  </SwiperItem>
                </Swiper>
              </View>
            </View>
          )}
          {showGuide3 && (
            <View className="fixed_modal_3">
              <View className="center_modal">
                <View className="modal_header">
                  <Text className="title">基金定投管家服务升级中！</Text>
                  <Text className="title">功能暂停开放</Text>
                  <Text className="subtitle" style={{ marginTop: "8PX" }}>
                    服务上线后会通知并发放基金定投
                  </Text>
                  <Text className="subtitle">管家升级期间会员时长</Text>
                </View>
                <View
                  className="modal_footer"
                  onClick={() => {
                    setShowGuide3(false);
                  }}
                >
                  <Text>确认</Text>
                </View>
              </View>
            </View>
          )}
          {showGuide4 && (
            <CommonModal
              title="定制你的定投方案"
              index={1}
              bool={false}
              openMember={() => {
                setShowGuide4(false);
                Taro.switchTab({
                  url: "/pages/member-buy/index",
                });
                sendPoint({
                  pageid: "Purchaseguide",
                  // ts: ts_in_app,
                  ts: Date.now(),
                  event: "click",
                });
              }}
              closeModal={() => {
                setShowGuide4(false);
              }}
            />
          )}
          <View className="fixed_tabbar">
            <CustomTabBar path="pages/fixed-housekeeper/index" />
          </View>
        </View>
      )}
    </>
  );
};
export default FixedHousekeeper;
