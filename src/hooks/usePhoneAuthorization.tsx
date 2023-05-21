import { Toast } from "@/components/Toast";
import { Button } from "@tarojs/components";
import Taro, { getCurrentPages } from "@tarojs/taro";
import React, { useEffect } from "react";
import request from "@/utils/request";
import {
  getStorage,
  setLocalToken,
  setLocalUid,
  setLocalUserType,
} from "@/utils/local";
import { getUserInfo } from "@/utils/getUserInfo";
import { useStoreDispatch } from "./useStore";
import { changeTabBar } from "@/utils/changeTabBar";
import { sendPoint } from "@/utils/sendPoint";
import { getInitModal } from "@/utils/getInitModal";
import { getPageId } from "@/config/page";

interface Props {
  callback?: (params?: any) => any;
  afterLoginCb?: () => any;
}

/** 缓存微信的code */
let codeCache = {
  code: "",
  expireDate: null,
  isLoading: false,
  get() {
    if (this.isLoading) {
      return new Promise((resolve) =>
        setTimeout(() => {
          resolve(codeCache.get());
        }, 100)
      );
    }
    if (this.code && this.expireDate > Date.now()) {
      console.log(
        `get cache wechat code: ${this.code} expire:${this.expireDate} `
      );
      return Promise.resolve(this.code);
    } else {
      this.isLoading = true;
      return Taro.login()
        .then((res) => {
          this.isLoading = false;
          this.code = res.code;
          this.expireDate = Date.now() + 1000 * 60 * 4;
          console.log(
            `get wechat code: ${this.code} expire:${this.expireDate} `
          );
          return res.code;
        })
        .catch((er) => {
          this.isLoading = false;
          throw er;
        });
    }
  },
  clear() {
    this.code = "";
    this.expireDate = "";
  },
};

export const usePhoneAuthorization = (params?: Props) => {
  const { callback, afterLoginCb } = params ?? {};
  useEffect(() => {
    codeCache.get();
  }, []);

  const dispatch = useStoreDispatch();

  // 根据入口判断跳转页面
  const jumpToPage = () => {
    const pages = getCurrentPages();
    const pageArr = pages.reduce((prev: string[], next) => {
      prev.push(next.route as string);
      return prev;
    }, []);

    if (pageArr.includes("pages/hold/index")) {
      getInitModal({
        pageid: "hold",
      }); // 获取弹窗信息
      return;
    }

    if (pageArr.includes("pages/optional/index")) {
      getInitModal({
        pageid: "optional",
      }); // 获取弹窗信息
      return;
    }

    if (pageArr.includes("pages/activity/index")) {
      callback && callback();
      return;
    }
    if (pageArr.includes("pages/fixed-housekeeper/index")) {
      callback && callback();

      return;
    }

    if (pageArr.includes("pages/member-buy/index")) {
      callback && callback();
      return;
    }
  };

  const phoneLogin = (data: {
    code: unknown;
    encryptedData: string;
    iv: string;
  }) => {
    const _initQuery_str = getStorage("initQuery");

    return request("/assistant/user/mini/phoneLogin2", {
      method: "POST",
      data: {
        ad_info: _initQuery_str || null,
        ...data,
      },
    });
  };

  const login = async (params: { encryptedData: string; iv: string }) => {
    Taro.showLoading({
      title: "加载中...",
    });

    try {
      // 检测sessionkey 是否过期
      const result = await Taro.checkSession();
      console.log("result:", result);
      // 获取缓存code
      const code = await codeCache.get();
      codeCache.clear();
      // 登录
      const res = await phoneLogin({ ...params, code });

      setLocalToken(`${res.token}`);
      setLocalUserType(`${res.user_type}`);
      setLocalUid(`${res.uid}`);
      dispatch({
        type: "global/setUserType",
        payload: `${res.user_type}`,
      });
      getUserInfo(); // 获取用户信息
      changeTabBar(); // 初始化tabbar

      if (afterLoginCb) {
        afterLoginCb();
      } else {
        jumpToPage();
      }

      sendPoint({
        event: "phoneempowerregister",
      });
      sendPoint({
        pageid: "phoneauth",
        ref: getPageId(),
        event: "callback",
        ctrl: "succ_callback",
        tag: res.is_new,
      });
    } catch (error) {
      console.error(error);
      codeCache.clear();
      codeCache.get();
    }

    Taro.hideLoading();
  };

  const onGetPhoneNumber = (e: {
    detail: { errMsg: string; encryptedData: string; iv: string };
  }) => {
    sendPoint({
      pageid: "phoneauth",
      ref: getPageId(),
      event: "load",
    });

    if (e?.detail?.errMsg.indexOf("ok") !== -1) {
      const _params = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      };

      login({
        ..._params,
      });
    } else {
      Toast.fail("已取消手机号授权");
      sendPoint({
        pageid: "phoneauth",
        ref: getPageId(),
        event: "callback",
        ctrl: "cancel_callback",
      });
    }
  };

  const renderPhoneAuthButton = () => {
    return (
      <>
        <Button
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 2,
            background: "transparent",
            width: "100%",
            height: "100%",
          }}
          open-type="getPhoneNumber"
          onGetPhoneNumber={onGetPhoneNumber}
        />
      </>
    );
  };
  return [renderPhoneAuthButton];
};
