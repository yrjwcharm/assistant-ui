import request from "@/utils/request";

// 获取基金的列表
// ?=2&page=0&size=30
export function listDiagnoseFund(params: {
  list_type: 1 | 2; // 消息类型 1: 自选; 2: 持有;
}) {
  return request("/assistant/diagnose/fund/list", {
    method: "GET",
    params: {
      ...params,
      page: 1,
      size: 100
    }
  });
}

// 获取页面的默认信息
export function defaultInfo() {
  return request("/assistant/layer/diagnose/list/defaultInfo", {
    method: "GET"
  });
}
