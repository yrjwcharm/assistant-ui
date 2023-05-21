import { useStoreState } from "@/hooks";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, ITouchEvent } from "@tarojs/components";

import Taro, { useDidShow, useDidHide } from "@tarojs/taro";
import { Dialog, Button, Countdown, Divider, Backdrop } from "@taroify/core";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import PaySuccessModal from "@/components/PaySuccessModal";
import { h5BaseURL } from "@/config";
import {
  callBuyMemberCardApi,
  callGetPayOrderInfo,
  callUnlockFund,
} from "../services";
import { IUserComboType, IUserComboListType } from "../type";

import "./index.less";
import { sendPoint } from "@/utils/sendPoint";
import { tabbarHeight } from "@/config/layoutSize";
import { getPageId } from "@/config/page";
interface IProps extends React.PropsWithChildren {
  data?: IUserComboListType;
  params?: any;
  btnText?: string;
  expire_timestamp: number;
}

interface ICardItemProps {
  data?: IUserComboType;
  index: number;
  select: number;
  count: number;
  onSelect: (arg0: number) => void;
}

function CardItem(props: ICardItemProps) {
  const { data, index, select, onSelect, count } = props;
  return (
    <View
      className={`cardItem ${index == select ? "selected" : ""} count_${count}`}
      onClick={() => {
        onSelect(index);
      }}
    >
      {data?.ass_tip && (
        <View className="flag">
          <Text
            style={{
              fontSize: data?.ass_tip?.length > 8 ? 9 : 11,
            }}
          >
            {data?.ass_tip}
          </Text>
        </View>
      )}
      <Text className="name">{data?.ass_name}</Text>
      <View className="price">
        <View>
          <Text className="unit">¥</Text>
          <Text className="new">{data?.ass_cost}</Text>
        </View>
        {data?.is_discount && <Text className="old">{data?.ass_price}</Text>}
      </View>
      <View
        className="combo_enjoy_level"
        style={{
          background: index == select ? "#F7E1BE" : "#E9EAEF",
        }}
      >
        <Text className="tip">{data?.ass_foot_tip}</Text>
      </View>
    </View>
  );
}

export default function BuyCard(props: IProps) {
  const {
    global: { userType },
  } = useStoreState();
  const { data, params, expire_timestamp, btnText } = props;
  const [select, setSelect] = useState<number>(1); // 当前选中的套餐
  const [showBombo, setShowBombo] = useState(false); // 显示套餐详情
  const [showPayModal, setShowPayModal] = useState(false); // 显示支付成功弹窗
  const [showUnlockTip, setShowUnlockTip] = useState(false); // 显示解锁基金弹窗
  const [startAnim, setStartAnim] = useState<boolean>(true); //启动动画
  const withFound = params?.withFound != undefined && params?.fund_code;
  useEffect(() => {
    let i = data?.combo_list?.findIndex((el) => el.is_active == 1);
    !withFound
      ? setSelect(i == -1 ? 0 : (i as number))
      : setSelect(params?.user_level > 2 ? 2 : 1);
  }, [data, withFound]);
  const [payRetain, setPayRetain] = useState(false);
  const [payModalConfig, setPayModalConfig] = useState<any>({}); // 支付成功弹窗配置
  const [renderPhoneAuthButton] = usePhoneAuthorization();

  const fund_code = params?.fund_code;

  const payFundInfo = useRef<any>();

  const jumpToProtocol = (e: ITouchEvent) => {
    e.stopPropagation();

    let url = h5BaseURL + `fund-assistant/member-service-protocol`;
    Taro.navigateTo({
      url: `/pages/web-view/index?url=${encodeURIComponent(
        url
      )}&title=基金理财助手小程序服务协议`,
    });
  };
  useDidShow(() => {
    //页面组件可见时启动动画
    setStartAnim(true);
  });
  useDidHide(() => {
    //页面隐藏时取消动画
    setStartAnim(false);
  });
  const log = () => {
    const combo = data?.combo_list?.[select] ?? undefined;

    sendPoint({
      pageid: "mine",
      event: "view",
      oid: combo?.id,
      ctrl: "pay_succ_window",
      tag: data?.tag ?? "",
    });
    sendPoint({
      pageid: "mine",
      event: "callback",
      oid: combo?.id,
      ctrl: "pay_succ_callback",
      tag: data?.tag ?? "",
    });
  };
  const handlePay = async () => {
    sendPoint({
      pageid: "member-buy",
      ref: getPageId(),
      event: "click",
      ctrl: "btn_retain_succ",
      // tag: res.is_new,
    });
    setPayRetain(false);
    const combo = data?.combo_list?.[select] ?? undefined;
    if (!combo) return;
    sendPoint({
      pageid: "mine",
      event: "submit",
      ctrl: "comb",
      oid: combo.id,
      tag: data?.tag ?? "",
    });

    if (userType != "2") return;

    Taro.showLoading({
      title: "请稍等...",
      mask: true,
    });
    const res = await callBuyMemberCardApi({
      product_id: combo!.id,
      price: combo!.ass_cost,
      pay_type: "wxmp",
      pay_way: "wxapp",
    });
    console.log("测试数据++++++", res);
    Taro.requestPayment({
      ...res,
      success: function (result) {
        let timer = setInterval(async () => {
          const response = await callGetPayOrderInfo(res["order_no"]);
          if (response.is_pay == 1) {
            timer && clearInterval(timer);
            Taro.eventCenter.trigger("member-buy_update");
            Taro.eventCenter.trigger("buy_trigger");
            log();
            payFundInfo.current = {
              unlock_re_id: response.unlock_re_id,
            };
            setPayModalConfig(response);
            setShowPayModal(true);
            Taro.hideLoading();
          }
        }, 1000);
      },
      fail: function (res) {
        Taro.hideLoading();
        sendPoint({
          pageid: "member-buy",
          ref: getPageId(),
          event: "view",
          ctrl: "retain_window",
          // tag: res.is_new,
        });
        setPayRetain(true);
      },
    });
  };
  const handlePayModalComplete = () => {
    setShowPayModal(false);
    if (params?.withFound != undefined) {
      Taro.navigateBack();
    }
  };

  const handleUnlock = async () => {
    Taro.showLoading({
      title: "请稍等...",
      mask: true,
    });
    const combo = data?.combo_list?.[select] ?? undefined;
    try {
      await callUnlockFund({
        ...(payFundInfo.current ?? {}),
        fund_code,
        combo_id: combo?.id,
      });
      Taro.eventCenter.trigger("member-buy_update");
      Taro.eventCenter.trigger("buy_trigger");
      setShowPayModal(false);
      setShowUnlockTip(true);
    } catch (err) {
      console.error(err);
    }
    Taro.hideLoading();
  };

  const handleSelectCombo = (idx: number) => {
    setSelect(idx);
    const comb = data?.combo_list?.[idx];
    sendPoint({
      pageid: "mine",
      event: "click",
      ctrl: "comb",
      oid: comb?.id,
    });
  };

  const handleUnlockClose = () => {
    setShowUnlockTip(false);
    Taro.navigateBack();
  };

  const comboList = data?.combo_list?.map((el, index) => {
    return {
      ass_day: el.ass_day,
      ass_lock_num: el.ass_lock_num,
      ass_name: el.ass_name,
      isActive: index == 1,
    };
  });
  const tableHead = ["套餐名称", "套餐有效期", "解锁基金数量"];
  return (
    <>
      <PaySuccessModal
        withFound={withFound}
        withConfig={payModalConfig}
        show={showPayModal}
        onClose={handlePayModalComplete}
        onUnLock={handleUnlock}
      />
      <View className="pay_retain_window">
        <Backdrop closeable={false} open={payRetain}>
          <View className="content_wrapper">
            <View className="content_title">
              {data?.combo_list?.[select]?.ass_type.indexOf("svip") != -1 ? (
                <Text>
                  确定不以
                  <Text className="catch">超低优惠价格</Text>购买
                </Text>
              ) : (
                <Text>
                  确定不以
                  <Text className="catch">
                    {data?.combo_list?.[select]?.ass_foot_tip}
                  </Text>
                  购买
                </Text>
              )}
              <Text>买卖信号套餐？</Text>
            </View>
            <Image
              mode="widthFix"
              className="image_intro"
              src="https://static.licaimofang.com/wp-content/uploads/2023/03/pay_more_right_2.png"
            />
            <View className="bottom_wrap">
              <View
                className="give_up"
                onClick={() => {
                  setPayRetain(false);
                  sendPoint({
                    pageid: "member-buy",
                    ref: getPageId(),
                    event: "click",
                    oid: data?.combo_list?.[select]?.id ?? "",
                    ctrl: "btn_retain_fail",
                    // tag: res.is_new,
                  });
                }}
              >
                <Text>放弃开通</Text>
              </View>
              <View className="keep_on" onClick={handlePay}>
                <Text>继续开通</Text>
              </View>
            </View>
          </View>
        </Backdrop>
      </View>
      <Dialog open={showBombo} onClose={setShowBombo}>
        <Dialog.Header>
          <Text className="detail_dialg_title">套餐详情</Text>
        </Dialog.Header>
        <Dialog.Content>
          <View id="table">
            <View className="table_grid">
              <View className="table_head">
                {tableHead.map((el, index) => {
                  return (
                    <View className="table_item" key={el + index}>
                      <Text className="table_item_text">{el}</Text>
                    </View>
                  );
                })}
              </View>
              {comboList?.map((el, index) => {
                return (
                  <View
                    className="table_wrap"
                    style={{
                      background: index % 2 == 1 ? "#f5f6f8" : "transparent",
                    }}
                  >
                    <View className="table_row">
                      <Text className="table_item_title">{el.ass_name}</Text>
                    </View>
                    <View className="table_row">
                      <Text className="table_item_title">
                        {el.ass_day == 0 ? "不限" : el.ass_day + `天`}
                      </Text>
                    </View>
                    <View className="table_row">
                      <Text className="table_item_title">
                        {el.ass_lock_num == 0 ? "不限" : el.ass_lock_num + "支"}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={{
              color: "#0051CC",
              fontSize: "14px",
              fontFamily: "PingFangSC-Semibold",
            }}
            onClick={() => setShowBombo(false)}
          >
            知道了
          </Button>
        </Dialog.Actions>
      </Dialog>
      <Dialog id="dialog" open={showUnlockTip} onClose={handleUnlockClose}>
        <Dialog.Header>
          <Text className="detail_dialg_title">买卖信号已解锁</Text>
        </Dialog.Header>
        <Dialog.Content>
          <View className="detail_dialg_content" />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={{
              color: "#0051CC",
              fontSize: "14px",
              fontFamily: "PingFangSC-Semibold",
            }}
            onClick={handleUnlockClose}
          >
            知道了
          </Button>
        </Dialog.Actions>
      </Dialog>
      <View className="buyCardWrap">
        <View className="buyCard">
          <View className="buyCard_header">
            <View className="left_side">
              <View className="headerBlock" />
              <Text className="headerTitle">开通套餐解锁完整买卖信号</Text>
            </View>
            <View
              className="right_side"
              onClick={() => {
                sendPoint({
                  pageid: "mine",
                  ref: getPageId(),
                  event: "click",
                  ctrl: "comb_detail",
                  // tag: res.is_new,
                });
                setShowBombo(true);
              }}
            >
              <Text className="detail_tip">套餐详情</Text>
              <Image
                src={require("@/assets/images/arrow_right.png")}
                className="icon"
              />
            </View>
          </View>
          <View className="shadowBlock">
            {userType !== "2" && (
              <View className="shadowWrap">
                {renderPhoneAuthButton()}
                <Image
                  className="img"
                  src={require("@assets/images/mine/lock-fill.png")}
                />
                <View className="title">
                  <Text>点击登录查看优惠套餐</Text>
                </View>
                <View className="desc">
                  <Text>
                    买卖点信号新升级，新的买卖点信号有80%的胜率提升您的盈利概率。赶快购买套餐提升你的盈利概率吧
                  </Text>
                </View>
              </View>
            )}
            {!expire_timestamp && <Divider />}
            {expire_timestamp - +new Date() >= 0 && (
              <View className="limit_preferential">
                <View className="limit_preferential_wrap">
                  <Text className="begin_txt">限时优惠</Text>
                  <Text className="count_down_txt">截止倒计时</Text>
                  <Countdown
                    value={expire_timestamp - +new Date()}
                    onComplete={() => {}}
                  >
                    {(current) => (
                      <>
                        <View className="block">
                          {current.days > 9 ? current.days : `0${current.days}`}
                        </View>
                        <View className="colon">天</View>
                        <View className="block">
                          {current.hours > 9
                            ? current.hours
                            : `0${current.hours}`}
                        </View>
                        <View className="colon">时</View>
                        <View className="block">
                          {current.minutes > 9
                            ? current.minutes
                            : `0${current.minutes}`}
                        </View>
                        <View className="colon">分</View>
                        <View className="block">
                          {current.seconds > 9
                            ? current.seconds
                            : `0${current.seconds}`}
                        </View>
                        <View className="colon">秒</View>
                      </>
                    )}
                  </Countdown>
                </View>
              </View>
            )}
            <View className="cardContainer">
              {(data?.combo_list ?? []).map((item, index: number) => (
                <CardItem
                  data={item}
                  index={index}
                  select={select}
                  count={data!.combo_list.length}
                  onSelect={handleSelectCombo}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
      {userType == "2" && (
        <View
          className="fix_pay"
          style={{ bottom: !withFound ? tabbarHeight : 0 }}
        >
          <View className="fix_pay_wrap">
            <View className="right_side">
              <View className="top_wrap" onClick={handlePay}>
                <Text className="price_symbol">¥</Text>
                <Text className="price">
                  {data?.combo_list[select]?.ass_cost}
                </Text>
                <Text className="immediate_upgrade">
                  {btnText ?? "立即支付"}
                </Text>
                {startAnim && (
                  <Image
                    mode="widthFix"
                    src={require("@/assets/images/flash.png")}
                    className="move"
                  />
                )}
              </View>
              <View className="bottom_wrap">
                <View className="policy_wrap">
                  <Text>点击购买代表您已同意</Text>

                  <Text className="policy" onClick={jumpToProtocol}>
                    《小程序服务协议》
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
