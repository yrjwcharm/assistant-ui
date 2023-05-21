/*
 * @Date: 2023-03-02 10:37:46
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-02 11:45:06
 * @FilePath: /assistant-ui/src/utils/webview.ts
 * @Description: webview bridge 处理h5发来的消息
 */

import { sendPoint } from "./sendPoint";
import { WebViewProps, BaseEventOrig } from "@tarojs/components";
import Taro from "@tarojs/taro";
interface IWebViewMsg {
  type: string;
  params: any;
}

type onMessageEvent = BaseEventOrig<WebViewProps.onMessageEventDetail>;

/** 友盟统计 */
const handleUmengMsg = (params: any) => {
  if (!params) return;
  sendPoint({
    ...params,
    isFromH5: true,
  });
};

const MsgTypeMap: { [key: string]: Function } = {
  umeng: handleUmengMsg /** 友盟统计 */,
};

const WebViewBridge = {
  /** 处理单个H5自定义消息 */
  handleH5Msg(msg: IWebViewMsg) {
    if (!msg || !msg.type) return;
    MsgTypeMap[msg.type]?.();
  },
  handleMsg(e: onMessageEvent) {
    const msgs = e.detail.data;
    let msg = msgs.filter((el) => el.type == "scroll");
    Taro.eventCenter.trigger("sendScrollTrigger", msg);
  },
  handleOnMessage(e: onMessageEvent) {
    const msgs = e.detail.data;
    msgs.forEach((m: IWebViewMsg) => {
      try {
        this.handleH5Msg(m);
      } catch (err) {}
    });
  },
};
export default WebViewBridge;
