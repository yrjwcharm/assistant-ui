/*
 * @Date: 2023-02-27 17:30:59
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-28 16:09:44
 * @FilePath: /assistant-ui/src/config/page.ts
 * @Description:
 */

import Taro from "@tarojs/taro";

interface IMap {
  [key: string]: string;
}
/** 页面对应的pageid */
const pageIdMap: IMap = {
  "/pages/web-signal-details/index": "Underdetail",
  "/pages/member-buy/index": "mine",
  "/pages/member-buy/pay": "mine",
  "/packageMenuActivity/pages/setmenu-activity/index": "newusercomb",
  "/pages/invite-good-friend/index": "Invitefriends",
  "/pages/buy-sell-signal/index": "signallist",
};

// 获取当前页面的pageid
const defaultPageId = "";
export function getPageId(page?: string) {
  if (!page) {
    page = Taro.getCurrentInstance().router?.path;
  }
  if (!page) {
    return defaultPageId;
  }

  return pageIdMap[page] ?? defaultPageId;
}

export default pageIdMap;
