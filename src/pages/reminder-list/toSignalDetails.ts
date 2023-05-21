import { h5BaseURL } from "@/config";
import { getLocalToken, getLocalUid, getStorage } from "@/utils/local";
import Taro from "@tarojs/taro";

export const toSignalDetails = (
  fund_code: string,
  redirect: boolean = false
) => {
  const token = getLocalToken();
  const uid = getLocalUid();

  const channel = getStorage("channel");
  const did = getStorage("did");
  // console.log(
  //   `${h5BaseURL}fund-assistant/signal-details?token=${token}&uid=${uid}&fund_code=${fund_code}&title=买卖点信号详情&chn=${channel}&did=${did}`
  // );
  const url = encodeURIComponent(
    `${h5BaseURL}fund-assistant/signal-details?token=${token}&uid=${uid}&fund_code=${fund_code}&title=买卖点信号详情&chn=${channel}&did=${did}`
  );
  if (redirect) {
    Taro.redirectTo({
      // url: `/pages/web-view/index?url=${url}`
      url: `/pages/web-signal-details/index?url=${url}`
    });
  } else {
    Taro.navigateTo({
      url: `/pages/web-signal-details/index?url=${url}`
    });
  }
};
