/*
 * @Date: 2023-02-22 11:26:28
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-03-06 14:17:43
 * @FilePath: /assistant-ui/src/utils/sendPoint.ts
 * @Description:
 */
import { getLocalUid, getStorage } from "./local";
import request from "./request";
import Taro from "@tarojs/taro";
import { accountInfo } from "@/config/layoutSize";

const reportInfo = (params: { [key: string]: any }) => {
  request("https://tj.licaimofang.com/v.gif", {
    method: "GET",
    params,
  }).catch(() => {
    // console.error(e);
  });
};

const sendPoint = (params: { [key: string]: any }) => {
  const uid = getLocalUid();
  const channel = getStorage("channel");
  const did = getStorage("did");
  const ver = accountInfo.miniProgram.version;
  const ts = Date.now();

  try {
    // @ts-ignore
    Taro.uma.trackEvent(`${params["pageid"]}_${params["event"]}`, {
      app: 5001,
      uid,
      ts: params.ts || ts,
      ver,
      chn: channel || "mini_program", // 渠道：mini_program(默认)
      did: did || "mini_did", // did(用户唯一标识)：mini_did(默认)
    });
    // h5 转发的统计，已经上报了
    if (params.isFromH5 != true) {
      reportInfo({
        app: 5001,
        uid,
        chn: channel || "mini_program", // 渠道：mini_program(默认)
        did: did || "mini_did", // did(用户唯一标识)：mini_did(默认)
        ts: params.ts || ts,
        ...params,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

export { sendPoint };
