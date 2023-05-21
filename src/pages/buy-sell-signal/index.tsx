/*
 * @Date: 2023/2/7 10:48
 * @Author: yanruifeng
 * @Description: 买卖信号页面
 */
import { Text, Image, View, ITouchEvent, ScrollView } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import "./index.less";
import {
  TSwiperItem,
  TNavItem,
  TIntro,
  TFundItem,
  THead,
  TSubjectItem,
  THeadItem,
  TProductHead,
  TProductItem,
} from "./type";
import CustomTabBar from "@/components/CustomTabBar";
import HomeNavNav from "@/components/HomeNav";
import Taro, {
  useDidShow,
  usePageScroll,
  useShareAppMessage,
} from "@tarojs/taro";
import { useStoreState } from "@/hooks";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import {
  callBuySellSignalInfoApi,
  callCancelFundApi,
  callFocusFundListApi,
  callFundUnlockApi,
  callHoldFundList,
  callMyFundTabApi,
  callQrCodeApi,
  callUnlockListAPi,
} from "@/pages/buy-sell-signal/services";
import { defaultshareInfo } from "@/config/variables";
import { toSignalDetails } from "@/pages/reminder-list/toSignalDetails";
import { Toast } from "@/components/Toast";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import { getStorage } from "@/utils/local";
import { h5BaseURL } from "@/config";
import { decorationColor } from "@/utils/common";
import { sendPoint } from "@/utils/sendPoint";
import { updateType } from "@/utils/getUserInfo";
import { callInviteCard } from "@/pages/web-signal-details/services";
import { tabbarHeight } from "@/config/layoutSize";
import OneBuyBall from "@/views/ActiveBall/OneBuyBall";
import LoadingTip from "@/components/Loading/Loading";
import FundListItem from "@/pages/buy-sell-signal/components/FundListItem";
import UnlockFundDialog from "@/pages/buy-sell-signal/components/UnlockFundDialog";
import HeaderComponent from "@/pages/buy-sell-signal/components/HeaderComponent";
import MyFundList from "@/pages/buy-sell-signal/components/MyFundList";
import { getPageId } from "@/config/page";
const statusBarHeight = Taro.getSystemInfoSync().statusBarHeight;
const BuySellSignal = () => {
  const {
    global: { userType, fundType },
  } = useStoreState();
  const [loading, setLoading] = useState<boolean>(true);
  const [renderPhoneAuthButton] = usePhoneAuthorization();
  const [intro, setIntro] = useState<TIntro>({
    more_img: "",
    scroll_icon: "",
    title: [],
    top: "",
  });
  const [hasBuyCombo, setHasBuyCombo] = useState<boolean>(false);
  const [[left, center, right], setHeadList] = useState<THead[]>([]);
  const [fundList, setFundList] = useState<TFundItem[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [head, setHead] = useState<THeadItem>({
    explain: "",
    desc: "",
    name: "",
    title: "",
    updated_at: "",
  });
  const [[leftSide, centerSide, rightSide], setProductHead] = useState<
    TProductHead[]
    >([]);
  const [productList, setProductList] = useState<TProductItem[]>();
  const [totalPage, setTotalPage] = useState<number>(1);
  const [subjectNav, setSubjectNav] = useState<TSubjectItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [subjectId, setSubjectId] = useState<string>("");
  const [list, setList] = useState<TProductItem[]>([]);
  const dispatch = useDispatch();
  const [swiperList, setSwiperList] = useState<TSwiperItem[]>([]);
  const [isExpand, setIsExpand] = useState<boolean>(true);
  const [navList, setNavList] = useState<TNavItem[]>([]);
  const [popImg, setPopImg] = useState<
    { pop_image: string; pop_type: string; url: string }[]
    >([]);
  const [popInfo, setPopInfo] = useState<string>("");
  const [userLevel, setUserLevel] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [button_info, setButtonInfo] = useState<string>("");
  const [fund_code, setFundCode] = useState<string>("");
  const [isProceed, setIsProceed] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [expireTxt, setExpireTxt] = useState<string>("");
  const [expireColor, setExpireColor] = useState<string>("");
  /**
   * 点击tab更新fundType类型
   * @param el
   * @param index
   */
  const onNavClick = async (el: TNavItem, index: 0 | 1 | 2) => {
    (index == 0 || index == 1) && setExpireTxt("");
    setFundList([]);
    sendPoint({
      pageid: "signallist",
      ts: Date.now(),
      ref: getPageId(),
      ctrl:
        index == 0
          ? "tab_hold_signal"
          : index == 1
            ? "tab_focus_signal"
            : "tab_unlock_signal",
      event: "view",
    });
    const map: {
      0: () => Promise<void>;
      1: () => Promise<void>;
      2: () => Promise<void>;
    } = {
      0: () => getHoldFundList(),
      1: () => getFocusFundList(),
      2: () => getUnLockList(),
    };
    navList.map((item) => {
      item.isActive = false;
      JSON.stringify(item) === JSON.stringify(el) && (item.isActive = true);
    });
    dispatch({
      type: "global/setFundType",
      payload: el.type,
    });
    setActiveIndex(index);
    setNavList([...navList]);
    map[index]();
  };
  useEffect(() => {
    sendPoint({
      pageid: "signallist",
      ts: Date.now(),
      event: "load",
    });
  }, []);
  useEffect(() => {
    initData();
    Taro.eventCenter.on("sendScrollTrigger", (msg) => {
      msg[0]?.type == "scroll" && scroll();
    });
    return () => {};
  }, []);

  /**
   * 定位位置
   */
  const scroll = () => {
    navList.map((item) => {
      item.isActive = item.type == "unlock";
    });
    setNavList([...navList]);
    dispatch({
      type: "global/setFundType",
      payload: "unlock",
    });
    setIsProceed(true);
    setScrollTop(scrollTop == 0 ? 0.1 : 0);
    getUnLockList();
  };
  const initData = async () => {
    const res = await callBuySellSignalInfoApi();
    const {
      intro = {},
      subject_list = [],
      scroll_show = [],
      subject_nav = [],
    } = res ?? {};
    setIntro(intro);
    setSwiperList(scroll_show);
    setSubjectNav(subject_nav);
    setSubjectId(subject_list[0]?.subject_id ?? "");
    const { th = [], items = [] } = subject_list[0]?.body?.products ?? [];
    setHead({
      ...(subject_list[0]?.header ?? {
        title: "",
        name: "",
        updated_at: "",
        desc: "",
      }),
      name: "换一批",
    });
    setProductHead(th);
    let totalPage = Math.ceil(items.length / 3);
    setTotalPage(totalPage);
    setProductList(items);
    setLoading(false);
  };
  usePageScroll(() => {});
  useEffect(() => {
    const list: TProductItem[] | undefined = productList?.filter(
      (item: TProductItem, index: number) =>
        index >= (page - 1) * 3 && index <= page * 3 - 1
    );
    setList(list ?? []);
  }, [productList, page]);

  /**
   * 刷新相关接口
   */
  useDidShow(() => {
    if (userType === "2") {
      initData();
      getMyFundTab();
      getActivePop();
      refreshList();
    }
  });
  const refreshList = () => {
    const map: {
      hold: () => Promise<void>;
      focus: () => Promise<void>;
      unlock: () => Promise<void>;
    } = {
      hold: () => getHoldFundList(),
      focus: () => getFocusFundList(),
      unlock: () => getUnLockList(),
    };
    // @ts-ignore
    map[fundType]();
  };
  // @ts-ignore
  useShareAppMessage(async (_res) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/buy-sell-signal/index" + path);
  });

  // @ts-ignore
  Taro.useShareTimeline(async (_res: any) => {
    const res = await callInviteCard({
      share_page: "public_page",
    });
    const { path } = res?.invite_info;
    return defaultshareInfo("/pages/buy-sell-signal/index" + path);
  });
  useEffect(() => {
    userType === "2" && getMyFundTab();
    userType === "2" && getHoldFundList();
    if (userType === "2") {
      initData();
      getMyFundTab();
      getActivePop();
      refreshList();
    }
  }, [userType]);
  /**
   * 登录后获取直播二维码展示
   */
  const getActivePop = async () => {
    const res = await callQrCodeApi();
    setPopImg(res?.pop ?? []);
  };
  /**
   * 持有基金、关注基金、已解锁信号的基金 tab
   */
  const getMyFundTab = async () => {
    const res = await callMyFundTabApi();
    let list = (res ?? []).map((item: TNavItem, index: number) => {
      return { isActive: item.type == fundType, ...item };
    });
    setNavList(list);
  };
  /**
   * 持有基金列表
   */
  const getHoldFundList = async () => {
    const res = await callHoldFundList();
    const { head = [], list = [], has_buy_combo = false } = res ?? {};
    setHeadList(head);
    list.length > 0 ? setIsEmpty(false) : setIsEmpty(true);
    setFundList(list);
    setHasBuyCombo(has_buy_combo);
  };
  /**
   * 关注基金列表
   */
  const getFocusFundList = async () => {
    const res = await callFocusFundListApi();
    const { head = [], list = [], has_buy_combo = false } = res ?? {};
    setHeadList(head);
    list.length > 0 ? setIsEmpty(false) : setIsEmpty(true);
    setFundList(list);
    setHasBuyCombo(has_buy_combo);
  };
  /**
   *  已解锁信号的基金列表
   */
  const getUnLockList = async () => {
    const res = await callUnlockListAPi();
    const {
      head = [],
      list = [],
      expire_txt = "",
      expire_txt_color = "",
    } = res ?? {};
    setHeadList(head);
    setExpireColor(expire_txt_color);
    setExpireTxt(expire_txt);
    list.length > 0 ? setIsEmpty(false) : setIsEmpty(true);
    setFundList(list);
  };
  const jumpToBuySellSignalDetail = (
    item: {
      daily_level: any;
      expire_txt?: string;
      fund_code: any;
      fund_name?: string;
      status?: number;
      nav?: number | undefined;
      is_lock?: boolean | undefined;
      over_percent?: string;
      history_percent?: string;
      expire_txt_color?: string | undefined;
    },
    index: number
  ) => {
    if (item.daily_level != 0) {
      toSignalDetails(item.fund_code);
    } else {
      Toast.info("该基金类型暂不支持买卖点信号");
    }
  };
  /**
   *  ! 取消解锁、点击解锁
   */
  const updateFundStatus = async (
    e: ITouchEvent,
    item: {
      daily_level?: number;
      expire_txt?: string;
      fund_code: string;
      fund_name?: string;
      status: any;
      nav?: number | undefined;
      is_lock?: boolean | undefined;
      over_percent?: string;
      history_percent?: string;
      expire_txt_color?: string | undefined;
    }
  ) => {
    setFundCode(item.fund_code);
    e.stopPropagation();
    Taro.showLoading({
      title: "请稍等...",
      mask: true,
    });
    if (item.status == 0) {
      sendPoint({
        pageid: "signallist",
        ref: getPageId(),
        event: "click",
        ctrl: "cancel_unlock",
        id: item.fund_code,
        // tag: res.is_new,
      });
      await callCancelFundApi({
        fund_code: item.fund_code,
      });
    } else if (item.status == 1) {
      const res = await callFundUnlockApi({
        fund_code: item.fund_code,
      });
      if (res.status == 0) {
        Taro.showToast({
          title: "解锁成功",
          icon: "success",
          duration: 1000,
          mask: true,
        });
      } else if (res.status == 10 || res.status == 11) {
        Taro.navigateTo({
          url: `/pages/member-buy/pay?withFound=true&fund_code=${item.fund_code}`,
        });
      } else if (res.status == 12) {
        sendPoint({
          pageid: "buy-sell-signal",
          ref: getPageId(),
          event: "view",
          ctrl: "unlock_quota_window",
          // tag: res.is_new,
        });
        setPopInfo(res.pop_info);
        setButtonInfo(res.button_info);
        setUserLevel(res.user_level);
        setVisible(true);
      }
    }
    getUnLockList();
    getMyFundTab();
    initData();
    Taro.hideLoading();
  };
  return (
    <ScrollView
      style={{ height: "100vh" }}
      scrollY={true}
      scrollTop={scrollTop}
    >
      {loading ? (
        <LoadingTip />
      ) : (
        <View
          className="buy_sell_box"
          style={{
            paddingTop: statusBarHeight ? statusBarHeight + 44 : 0,
            paddingBottom: tabbarHeight + (userType === "2" ? 50 : 0),
          }}
        >
          {/*顶部导航栏*/}
          <View className="fixed_nav">
            <HomeNavNav nohead={true} title="基金理财助手" />
          </View>
          <View className="buy_sell_box_content">
            {!isProceed && (
              <>
                <HeaderComponent
                  isExpand={isExpand}
                  swiperList={swiperList}
                  headerSearchClick={() => {
                    if (userType == "2") {
                      sendPoint({
                        pageid: "signallist",
                        ts: Date.now(),
                        // ts: ts_in_app,
                        event: "click2",
                      });
                      dispatch({
                        type: "global/setFundType",
                        payload: "hold",
                      });
                      Taro.navigateTo({
                        url: "/pages/search-fund/index",
                      });
                    }
                  }}
                  intro={intro}
                  expandClick={() => {
                    if (!isExpand)
                      sendPoint({
                        pageid: "signallist",
                        ts: Date.now(),
                        event: "click1",
                      });
                    setIsExpand(!isExpand);
                  }}
                />
                {/*潜力牛基榜-明星经理牛基榜-潜力板块牛基榜*/}
                <View className="rank_list_level">
                  {userType !== "2" ? renderPhoneAuthButton() : null}
                  {subjectNav.map((el: TSubjectItem, index: number) => {
                    return (
                      <View
                        key={index + ``}
                        onClick={() => {
                          sendPoint({
                            pageid: "signallist",
                            ts: Date.now(),
                            // ts: ts_in_app,
                            event:
                              index == 0
                                ? "click4"
                                : index == 1
                                  ? "click5"
                                  : "click6",
                          });
                          Taro.navigateTo({
                            url: `/pages/excess-profit-list/index?subject_id=${el.id}&index=${index}`,
                          });
                        }}
                        className="rank_item"
                      >
                        <Image className="icon" src={el.icon} />
                        <Text className="title">{el.text}</Text>
                      </View>
                    );
                  })}
                </View>
                {/*信号超额收益基金推荐*/}
                {list?.length > 0 && (
                  <View className="signal_recommend">
                    {userType !== "2" ? renderPhoneAuthButton() : null}
                    <View className="signal_recommend_header">
                      <View className="header_wrap">
                        <View className="left">
                          <View className="separator" />
                          <View className="title_wrap">
                            <Text className="title">{head?.title}</Text>
                            {head.explain && (
                              <Image
                                src={require("@/assets/images/ask_symbol.png")}
                                className="ask"
                                onClick={() => {
                                  Taro.showModal({
                                    content: head.explain,
                                    confirmText: "知道了",
                                    showCancel: false,
                                    confirmColor: "#0051CC",
                                  });
                                }}
                              />
                            )}
                          </View>
                          <Text className="update_date">
                            {head?.updated_at &&
                              dayjs(head?.updated_at).format("MM-DD")}
                            更新
                          </Text>
                        </View>
                        <View
                          className="replace"
                          onClick={() => {
                            page >= totalPage
                              ? setPage(1)
                              : setPage((page) => page + 1);
                          }}
                        >
                          <Text className="replace_title">{head?.name}</Text>
                          <Image
                            className="icon"
                            src={require("@/assets/images/buy-sell-signal/turn_over.png")}
                          />
                        </View>
                      </View>
                    </View>
                    <View className="signal_recommend_content">
                      <View className="content_header">
                        <View className="header_wrap">
                          <Text className="fund_name">{leftSide?.value}</Text>
                          <View className="history_wrap">
                            <Text className="history_profit">
                              {centerSide?.value}
                            </Text>
                            {centerSide?.explain && (
                              <Image
                                src={require("@/assets/images/ask_symbol.png")}
                                className="ask"
                                onClick={() => {
                                  Taro.showModal({
                                    content: centerSide.explain,
                                    confirmColor: "#0051CC",
                                    showCancel: false,
                                    confirmText: "知道了",
                                  });
                                }}
                              />
                            )}
                          </View>
                          <Text className="superProfit">
                            {rightSide?.value}
                          </Text>
                        </View>
                      </View>
                      <View className="my_fund_content">
                        {list.map((item, index) => {
                          const [left, center, right] = item.td ?? [];
                          return (
                            <View
                              className="content_list"
                              onClick={(e) => {
                                if (userType == "2") {
                                  const url = encodeURIComponent(
                                    `${h5BaseURL}fund-assistant/signal-details?token=${getStorage(
                                      "token"
                                    )}&uid=${getStorage("uid")}&fund_code=${
                                      left.secondary
                                    }&chn=${getStorage(
                                      "channel"
                                    )}&did=${getStorage("did")}&is_cover=${
                                      left.is_cover ? 1 : 0
                                    }`
                                  );
                                  Taro.navigateTo({
                                    url: `/pages/web-signal-details/index?url=${url}`,
                                  });
                                }
                              }}
                            >
                              <View className="left">
                                <Text className="fund_name">{left.value}</Text>
                                <Text className="fund_code">
                                  {left.secondary}
                                </Text>
                                {left.is_cover && (
                                  <View className="mask">
                                    <Text className="title">
                                      {left.cover_text}
                                    </Text>
                                  </View>
                                )}
                              </View>
                              <View className="center">
                                <Text
                                  className="title"
                                  style={{
                                    color: decorationColor(center.value),
                                  }}
                                >
                                  {center.value}
                                </Text>
                              </View>
                              <View className="right">
                                <Text
                                  className="title"
                                  style={{
                                    color: decorationColor(right.value),
                                  }}
                                >
                                  {right.value}
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                    <View className="signal_recommend_footer">
                      <View
                        className="more_wrap"
                        onClick={() => {
                          sendPoint({
                            pageid: "signallist",
                            ts: Date.now(),
                            // ts: ts_in_app,
                            event: "click7",
                          });
                          Taro.navigateTo({
                            url: `/pages/excess-profit-list/index?subject_id=${subjectId}&index=4`,
                          });
                        }}
                      >
                        <Text className="more">查看更多</Text>
                        <Image
                          className="forward"
                          src={require("@/assets/images/buy-sell-signal/forward.png")}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </>
            )}
            {/*我的基金+ 买卖信号*/}
            <MyFundList
              id="nav_list"
              navList={navList}
              onNavClick={onNavClick}
              hasBuyCombo={hasBuyCombo}
              left={left}
              right={right}
              center={center}
              fundList={fundList}
              isEmpty={isEmpty}
              activeIndex={activeIndex}
              toBuySellSignalDetail={jumpToBuySellSignalDetail}
              updateFundStatus={(e, item: TFundItem) => {
                e.stopPropagation();
                updateFundStatus(e, item);
              }}
              expireTxt={expireTxt}
              expireTxtColor={expireColor}
            />
          </View>
          {userType === "2" && (
            <View
              className="fixed_operator_fund"
              style={{ bottom: tabbarHeight }}
            >
              <View className="fund_wrap">
                <View
                  className="left"
                  onClick={() => {
                    Taro.navigateTo({
                      url: "/packageAddFund/pages/arrange-fund/index?page_type=signal",
                    });
                  }}
                >
                  <Image
                    className="edit_icon"
                    src={require("@/assets/images/buy-sell-signal/edit_icon.png")}
                  />
                  <Text className="edit">编辑基金</Text>
                </View>
                <View
                  className="right"
                  onClick={() => {
                    updateType("buySignal");
                    Taro.navigateTo({
                      url: `/packageAddFund/pages/add-fund/index`,
                    });
                  }}
                >
                  <Image
                    src={require("@/assets/images/buy-sell-signal/upload.png")}
                    className="add"
                  />
                  <Text className="upload_text">上传基金查看买卖点</Text>
                </View>
              </View>
            </View>
          )}
          {popImg?.length > 0 && (
            <View
              className="fixed_pop"
              onClick={() => {
                dispatch({
                  type: "global/setType",
                  payload: "buySignal",
                });

                Taro.navigateTo({
                  url: `/packageAddFund/pages/add-fund/index?type=3`,
                });

                sendPoint({
                  pageid: "Holdingfund",
                  ts: Date.now(),
                  event: "click",
                });
              }}
            >
              <View className="pop_view">
                <Image
                  className="pop_img"
                  src={popImg[0].pop_image}
                  mode="widthFix"
                />
                <Image
                  onClick={() => {
                    setPopImg([]);
                  }}
                  src={require("@assets/images/close_circle.png")}
                  className="close_circle"
                />
              </View>
            </View>
          )}
          <OneBuyBall />
          {/*解锁基金用光弹窗*/}
          <UnlockFundDialog
            visible={visible}
            popInfo={popInfo}
            upgradeClick={(e) => {
              e.stopPropagation();
              setVisible(false);
              Taro.navigateTo({
                url: `/pages/member-buy/pay?withFound=true&user_level=${userLevel}&fund_code=${fund_code}`,
              });
              sendPoint({
                pageid: "buy-sell-signal",
                ref: getPageId(),
                event: "click",
                ctrl: "btn_up",
                // tag: res.is_new,
              });
            }}
            button_info={button_info}
            mangeFundClick={(e) => {
              e.stopPropagation();
              setVisible(false);
              scroll();
              sendPoint({
                pageid: "buy-sell-signal",
                ref: getPageId(),
                event: "click",
                ctrl: "btn_manage_unlock",
                // tag: res.is_new,
              });
            }}
          />
          {isProceed && (
            <FundListItem
              item={fundList[0]}
              fundType={fundType}
              hasBuyCombo={hasBuyCombo}
              close={() => {
                setIsProceed(false);
              }}
            />
          )}
          {/*  底部tabbar*/}
          <View className="fixed_tabbar">
            <CustomTabBar path="pages/buy-sell-signal/index" />
          </View>
        </View>
      )}
    </ScrollView>
  );
};
export default BuySellSignal;
