import { axios } from "taro-axios";
import { baseURL } from "@/config";
import { Toast } from "@/components/Toast";

import Taro from "@tarojs/taro";
import store from "@/config/dva";

import {
  getLocalToken,
  getLocalUid,
  getLocalUserType,
  removeLocalToken,
  removeLocalUid,
  removeLocalUserType,
} from "./local";
import { defaultUserInfo } from "@/config/variables";
const ERR_OK = "000000"; // 请求成功
const ERR_TOKEN = "000403"; // token失效或者丢失 需要重新登录
const ERR_FAILED = "999997"; // 请求错误

const service = axios.create({
  baseURL: baseURL,
  timeout: 20000,
});

service.interceptors.request.use(async (config: any) => {
  const token = getLocalToken();
  const user_type = getLocalUserType();
  if (token) {
    config.headers.Authorization = token;
  }
  if (config.method === "get") {
    config.params = {
      ...config.params,
      user_type: user_type || "0",
      // uid: uid || 0
    };
  } else if (config.method === "post") {
    config.data = {
      ...config.data,
      user_type: user_type || "0",
      // uid: uid || 0
    };
  }
  return config;
});

service.interceptors.response.use(
  async (response: any): Promise<any> => {
    const {
      request,
      status,
      data: { code, result, message },
    }: any = response;
    const { responseType } = request;
    if (status) {
      if (status === 200) {
        // 导出文件时 responseType 为 blob
        if (responseType === "blob") {
          return Promise.resolve(response.data);
        }
        // token失效
        if (code === ERR_TOKEN) {
          Toast.fail("登录已过期，请重新登录");
          const token = getLocalToken();
          const user_type = getLocalUserType();
          const uid = getLocalUid();

          if (token) removeLocalToken();
          if (user_type) removeLocalUserType();
          if (uid) removeLocalUid();

          store.dispatch({
            type: "global/setUserType",
            payload: "0",
          });
          store.dispatch({
            type: "global/setUserInfo",
            payload: defaultUserInfo,
          });
          setTimeout(() => {
            Taro.switchTab({
              url: "/pages/buy-sell-signal/index",
            });
          }, 1000);
          return Promise.reject(response.data);
        }

        if (code === ERR_OK) {
          return Promise.resolve(result);
        }
        if (code === ERR_FAILED) {
          Toast.fail(message || "未知错误");
          return Promise.reject(response.data);
        }
        if (
          response?.config?.url?.indexOf("https://tj.licaimofang.com/v.gif") !==
          -1
        ) {
          return Promise.reject(response.data);
        }
        Toast.fail(message || "未知错误");
        return Promise.reject(response.data);
      } else {
        Toast.info("服务器发生错误，请稍后再试");
      }
      return Promise.reject(response.data);
    } else {
      Toast.info("服务器发生错误，请稍后再试");
    }
  },
  async (e) => {
    if (e.code === "ECONNABORTED" && e.message.indexOf("timeout") !== -1) {
      Toast.fail("请求超时！");
      return Promise.reject(e);
    }
    const { status } = e.response;
    if (String(status) === "500") {
      Toast.info("服务器发生错误，请稍后再试");
      return Promise.reject(e);
    }
    return Promise.reject(e);
  }
);

export default service as any;
