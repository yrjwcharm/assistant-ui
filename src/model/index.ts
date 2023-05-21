/*
 * @Date: 2023-01-03 11:15:16
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-27 11:09:25
 * @FilePath: /assistant-ui/src/model/index.ts
 * @Description:
 */
import tabBar from "./tabBar";
import global from "./global";
import fund from "./fund";

export type RootState = {
  global: typeof global.state;
  tabBar: typeof tabBar.state;
  fund: typeof fund.state;
};
const models = [tabBar, global, fund];
export default models;
