/*
 * @Date: 2023-02-06 10:39:01
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-27 14:06:48
 * @FilePath: /assistant-ui/src/uma/index.weapp.js
 * @Description: 友盟统计配置文件
 */
import uma from "umtrack-wx";
uma.init({
  appKey: "63d74bb7ba6a5259c4f35a84",
  useOpenid: true,
  autoGetOpenid: true,
  debug: false,
  uploadUserInfo: true,
  enableVerify: false,
});
export default uma;
