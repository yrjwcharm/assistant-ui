import { h5BaseURL } from "@/config";
import { getLocalToken, getLocalUid, getStorage } from "@/utils/local";
import Taro from "@tarojs/taro";
// diagnostic-report
export const toDiagnosticReport = (
  fund_code: string,
  redirect: boolean = false
) => {
  const token = getLocalToken();
  const uid = getLocalUid();

  const channel = getStorage("channel");
  const did = getStorage("did");
  // console.log(
  //   `${h5BaseURL}fund-assistant/diagnostic-report?token=${token}&uid=${uid}&fund_code=${fund_code}&title=基金诊断&chn=${channel}&did=${did}`
  // );
  const url = encodeURIComponent(
    `${h5BaseURL}fund-assistant/diagnostic-report?token=${token}&uid=${uid}&fund_code=${fund_code}&title=基金诊断&chn=${channel}&did=${did}`
  );
  if (redirect) {
    Taro.redirectTo({
      // url: `/pages/web-view/index?url=${url}`
      url: `/packagePage/pages/web-diagnostic-report/index?url=${url}`
    });
  } else {
    Taro.navigateTo({
      // url: `/pages/web-view/index?url=${url}`
      url: `/packagePage/pages/web-diagnostic-report/index?url=${url}`
    });
  }
};
