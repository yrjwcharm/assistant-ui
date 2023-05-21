/*
 * @Date: 2023-01-03 11:15:35
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-21 17:03:56
 * @FilePath: /assistant-ui/src/pages/member-buy/services.ts
 * @Description:
 */
import request from "@/utils/request";
import { SetStateAction } from "react";

/** 获取需要展示活动的页面  */
export function callGetAllPageActivity() {
  return request("/assistant/activity/page/show", {
    method: "GET",
  });
}

/** 预下单 购买套餐 */
export function callBuyMemberCardApi(data: {
  product_id: number;
  price: string;
  pay_type: string;
  pay_way: string;
}) {
  return request("/assistant/user/combo/order/pay", {
    method: "POST",
    data,
  });
}

/** 轮询 订单支付结果 */
export function callGetPayOrderInfo(order_no: any) {
  return request(`/assistant/user/combo/order/info?order_no=${order_no}`, {
    method: "GET",
    order_no,
  });
}

/** 用套餐解锁基金 */
export function callUnlockFund(data: any) {
  return request(`/assistant/user/right/unlock/fund`, {
    method: "POST",
    data,
  });
}

/** 获取可以购买的套餐列表 */
export function callGetMemberTypeInfo() {
  return request(`/assistant/user/combo/newIndex`, {
    method: "GET",
  });
}

/** 获取已经购买的套餐列表 */
export function callGetCombolist(type: SetStateAction<number>) {
  return request(`/assistant/user/combo/list?combo_type=${type}`, {
    method: "GET",
  });
}
