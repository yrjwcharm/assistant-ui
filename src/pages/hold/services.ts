/*
 * @Date: 2023-02-06 10:36:00
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-07 14:52:08
 * @FilePath: /assistant-ui/src/pages/hold/services.ts
 * @Description:
 */
import request from "@/utils/request";

// 获取持仓基金的列表
export function listOwnFund() {
  return request("/assistant/fundManage/listOwnFund", {
    method: "POST",
  });
}

// 获取关注基金的列表
export function listOptionalFund() {
  return request("/assistant/fundManage/listOptionalFund", {
    method: "POST",
  });
}

// 获取未登录时页面图片
export function defaultInfo(params: { page: string }) {
  return request("/assistant/layer/home/defaultInfo", {
    method: "GET",
    params,
  });
}

// 获取新增/编辑按钮的可点击状态
export function getCurrWrite() {
  return request("/assistant/user/activity/getCurrWrite", {
    method: "POST",
  });
}
export function callBannerListApi() {
  return request(`/assistant/layer/banner/list`, {
    method: "GET",
  });
}
