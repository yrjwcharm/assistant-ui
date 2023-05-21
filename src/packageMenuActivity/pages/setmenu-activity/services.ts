/*
 * @Date: 2023-01-03 11:15:35
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-27 11:44:41
 * @FilePath: /assistant-ui/src/pages/setmenu-activity/services.ts
 * @Description:
 */
import request from "@/utils/request";

/** 获取需要展示活动的页面  */
export function callGetAllPageActivity() {
  // return request("/assistant/activity/page/show", {
  //   method: "GET",
  // });

  /*

  "oneBuy": {
              "status": 1,
              "show_txt": "一元",
              "info": [],
              "url": "/pages/setmenu-activity/index"
          }

 "specialChannel": {
                  "status": 1,
                  "show_txt": "专属折扣倒计时",
                  "diff_days": 7,
                  "end_timestamp": 1677599999,
                  "url": "/pages/member-buy/myCombo"
              }

  */
  return Promise.resolve(
    JSON.parse(`
  {

          "/pages/member-buy/index": {
            "specialChannel": {
              "status": 1,
              "show_txt": "专属折扣倒计时",
              "diff_days": 7,
              "end_timestamp": 1677599999,
              "url": "/pages/setmenu-activity/index"
          }

        }
  }
    `)
  );
}

/** 1元购的活动落地页 */
export function callGetOneBuyActivityInfo() {
  return request("/assistant/activity/newer/buy/detail", {
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
