import request from "@/utils/request";

// 获取页面内容
export function defaultInfo(params: {
  page: string; // 持有:hold  关注:optional
}) {
  return request("/assistant/layer/uploadFund/defaultInfo", {
    method: "GET",
    params
  });
}
