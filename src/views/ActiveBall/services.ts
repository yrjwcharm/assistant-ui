/*
 * @Date: 2023-01-03 11:15:35
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-02 17:40:39
 * @FilePath: /assistant-ui/src/views/ActiveBall/services.ts
 * @Description:
 */
import request from "@/utils/request";

/** 获取需要展示活动的页面  */
export function callGetAllPageActivity() {
  return request("/assistant/activity/page/show", {
    method: "GET",
  });

  // return JSON.parse(`
  //   {
  // "/pages/buy-sell-signal/index": {
  //   "specialChannel": {
  //     "show_txt": "7天",
  //     "url": "/packageMenuActivity/pages/setmenu-activity/index"
  //   }
  // }
  //   }
  // `);
}
