import { useStoreState } from "@/hooks";
import React, { useRef, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Dialog, Button } from "@taroify/core";
import { usePhoneAuthorization } from "@/hooks/usePhoneAuthorization";
import PaySuccessModal from "@/components/PaySuccessModal";
import { h5BaseURL } from "@/config";
import { callBuyMemberCardApi, callGetPayOrderInfo } from "../services";
import { IOneBuydetail } from "../type";

import "./index.less";
import { sendPoint } from "@/utils/sendPoint";

interface IProps extends React.PropsWithChildren {
  data?: IOneBuydetail;
  isBottom: Boolean;
}

export default function BuyBtn(props: IProps) {
  const {
    global: { userType },
  } = useStoreState();
  const { data, isBottom } = props;
  const [showPayModal, setShowPayModal] = useState(false); // 显示支付成功弹窗
  const [showTipModal, setShowTipModal] = useState(false); // 提示

  const [renderPhoneAuthButton] = usePhoneAuthorization();

  const payFundInfo = useRef<any>();

  const jumpToProtocol = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();

    let url = h5BaseURL + `fund-assistant/member-service-protocol`;
    Taro.navigateTo({
      url: `/pages/web-view/index?url=${encodeURIComponent(
        url
      )}&title=基金理财助手小程序服务协议`,
    });
  };

  const log = () => {
    const combo = data!.combo!;
    sendPoint({
      pageid: "newusercomb",
      event: "view",
      oid: combo?.id,
      ctrl: "pay_succ_window",
    });
    sendPoint({
      pageid: "newusercomb",
      event: "callback",
      oid: combo?.id,
      ctrl: "pay_succ_callback",
    });
  };
  const handlePay = async () => {
    const combo = data?.combo;
    if (!combo) return;

    sendPoint({
      pageid: "newusercomb",
      event: "submit",
      ctrl: "comb",
      oid: combo.id,
    });

    if (userType != "2" || !combo) return;
    if (data?.status == 2) {
      setShowTipModal(true);
      sendPoint({
        pageid: "newusercomb",
        event: "view",
        ctrl: "ineligible_window",
      });
      return;
    }

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
            setShowPayModal(true);

            Taro.hideLoading();
          }
        }, 1000);
      },
      fail: function (res) {
        Taro.hideLoading();
      },
    });
  };
  const handlePayModalComplete = () => {
    setShowPayModal(false);

    Taro.redirectTo({
      url: "/packagePage/pages/follow-official-account/index?back_type=2",
    });
  };

  const handleClose = () => {
    setShowTipModal(false);
    Taro.switchTab({
      url: "/pages/member-buy/index",
    });
  };

  let old_price = data?.combo?.ass_price ?? "40";

  return (
    <>
      <PaySuccessModal
        withConfig={{}}
        withFound={false}
        show={showPayModal}
        onClose={handlePayModalComplete}
      />
      <Dialog open={showTipModal}>
        <Dialog.Content>
          <Text
            style={{
              fontSize: "16px",
              fontFamily: "PingFangSC-Medium",
              color: "#1F2432",
            }}
          >
            {data?.message}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={{
              fontSize: "16px",
              fontFamily: "PingFangSC-Medium",
              color: "#0051CC",
            }}
            onClick={handleClose}
          >
            确认
          </Button>
        </Dialog.Actions>
      </Dialog>

      <View className="buyCard">
        <View className="btnWrap">
          {userType !== "2" && renderPhoneAuthButton()}
          <View className="paybtn animator" onClick={handlePay}>
            <View className="tip">
              <Text>{data?.intro?.button_tip ?? "体验10支基金买卖信号"}</Text>
            </View>
            <Text className="btn_text">
              {data?.intro?.button_txt ?? "1元立即体验"}
            </Text>
            {old_price && (
              <Text className="btn_desc">
                原价：<Text className="price">{old_price}元</Text>
              </Text>
            )}
          </View>
        </View>

        {!isBottom && (
          <View className="policyWrap">
            <Text className="weak" style={{ marginLeft: "-4px" }}>
              点击购买代表您已同意
            </Text>
            <Text className="hightlight" onClick={jumpToProtocol}>
              《小程序服务协议》
            </Text>
          </View>
        )}
      </View>
    </>
  );
}
