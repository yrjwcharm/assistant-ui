// 获取页面的默认信息
import request from "@/utils/request";

export function callGetFixInfo() {
  return request("/assistant/layer/fund/investPlan/defaultInfo", {
    method: "GET",
  });
}

export function callFixedPlanList(params: any) {
  return request(`assistant/invest/plan/list`, {
    method: "GET",
    params,
  });
}

export function callCalcFixedProfit(uid: string) {
  return request(`/assistant/invest/plan/calculate?uid=${uid}`, {
    method: "GET",
  });
}
