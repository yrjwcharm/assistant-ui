import "./app.less";
import { Provider } from "react-redux";
import store from "@/config/dva";
import React, { useEffect } from "react";
import { useDidShow } from "@tarojs/taro";
import md5 from "js-md5";
// @ts-ignore
import uma from "./uma/index.weapp";
import { changeTabBar } from "./utils/changeTabBar";
import { getLocalUserType, getStorage, setStorage } from "./utils/local";
import { getUserInfo } from "./utils/getUserInfo";
import { sendPoint } from "./utils/sendPoint";
import Taro from "@tarojs/taro";
import { getDid } from "./utils/getDid";
import { getQueryParams } from "@/utils/url";
(Taro as any).uma = uma;
const initTabBar = () => {
  changeTabBar();
};
const App = (props: { children: any }) => {
  const options = Taro.getEnterOptionsSync();

  console.log("app", options);

  const handleOptions = async (
    options: Taro.getEnterOptionsSync.EnterOptions
  ) => {
    const _query: TaroGeneral.IAnyObject = options?.query || null;
    // 用户来源渠道，只能设置一次，后面不可再设置改变！！
    let channel = getStorage("channel");
    // 用户唯一标识 没登录也存在
    const _did = getStorage("did");

    //  太阳码裂变活动, 特殊
    let invite_id, ad_channel;

    if (_query) {
      try {
        //  太阳码裂变活动, 特殊
        const activityParams = getQueryParams(
          decodeURIComponent(_query.scene)
        ) as { invite_id: string; ad_channel: string };

        ({ invite_id, ad_channel } = activityParams);
      } catch (error) {}
    }

    if (invite_id) {
      //  太阳码裂变活动, 特殊
      setStorage(
        "initQuery",
        JSON.stringify({
          invite_id,
          ad_channel,
        })
      );
    } else {
      // 一般流程，登录时需要
      const _qurey_str = JSON.stringify(_query);
      setStorage("initQuery", _qurey_str);
    }

    // 默认渠道
    if (!channel) {
      const _channel =
        ad_channel || options?.query?.ad_channel || "mini_program";
      setStorage("channel", _channel);
    }

    if (!_did) {
      if (options?.query?.clickid) {
        try {
          let _md5_id = md5(options?.query?.clickid);
          setStorage("did", `${_md5_id}`);
        } catch (error) {}
      } else {
        let _scene = options.scene;
        try {
          await getDid(_scene); // 获取did
        } catch (error) {}
      }
    }

    sendPoint({
      pageid: "Fundassistantmini",
      event: "load",
    });
  };

  const _getSystemInfo = () => {
    if (process.env.TARO_ENV === "weapp") {
      Taro.getSystemInfo({
        success: function (res) {
          //model中包含着设备信息
          console.log(res.model);
          var model = res.model;
          if (
            model.search("iPhone X") != -1 ||
            model.search("iPhone 11") != -1 ||
            model.search("iPhone 12") != -1 ||
            model.search("iPhone 13") != -1 ||
            model.search("iPhone 14") != -1
          ) {
            Taro.setStorageSync("isIphoneX", true);
          } else {
            Taro.setStorageSync("isIphoneX", false);
          }
        },
      });
    }
  };
  const update = () => {
    if (process.env.TARO_ENV === "weapp") {
      const updateManager = Taro.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log("是否有更新的版本", res.hasUpdate);
      });
      updateManager.onUpdateReady(function () {
        Taro.showModal({
          title: "更新提示",
          showCancel: false,
          confirmColor: "#0051CC",
          content: "新版本已经准备好，是否重启应用？",
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
      });
    }
  };

  useEffect(() => {
    handleOptions(options);
    update();
    _getSystemInfo();
  }, [options]);

  useDidShow(() => {
    // console.log("app_options_useDidShow", options);
    const userType = getLocalUserType();
    if (userType) {
      store.dispatch({
        type: "global/setUserType",
        payload: userType,
      });
    } else {
      store.dispatch({
        type: "global/setUserType",
        payload: "0",
      });
    }
    initTabBar(); // 初始化tabbar
    // getInitModal(); // 引导弹窗
    getUserInfo(); // 获取用户信息
  });
  return <Provider store={store}>{props.children}</Provider>;
};

export default App;
