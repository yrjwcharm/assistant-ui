// 获取页面的默认信息
import request from "@/utils/request";

/**
 *
 * @param
 */
export function callBuySellSignalInfoApi() {
  return request(`/assistant/layer/diagnose/intro`, {
    method: "GET",
  });
}

export function callUnlockListAPi() {
  return request(`/assistant/fund/manage/unlock/list`, {
    method: "GET",
  });
}
export function callMyFundTabApi() {
  return request(`/assistant/fund/manage/tab`, {
    method: "GET",
  });
}
export function callQrCodeApi() {
  return request(`/assistant/layer/loginPop`, {
    method: "GET",
  });
}

/**
 * 持有列表
 */
export function callHoldFundList() {
  return request(`/assistant/fund/manage/own/list`, {
    method: "GET",
  });
}

/**
 * 关注基金接口
 *
 */
export function callFocusFundListApi() {
  return request(`/assistant/fund/manage/optional/list`, {
    method: "GET",
  });
}
export type unlockInfo = {
  fund_code: string;
  unlock_re_id?: number;
  combo_id?: number;
  uid?: string;
};
export const callFundUnlockApi = (params: unlockInfo) => {
  return request(`/assistant/user/right/unlock/fund`, {
    method: "POST",
    params,
  });
};
export const callCancelFundApi = (params: { fund_code: string }) => {
  return request(`/assistant/user/right/unlock/fund/cancel`, {
    method: "POST",
    params,
  });
};
