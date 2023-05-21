import { Toast } from "@/components/Toast";
import { baseURL } from "@/config";
import { useStoreDispatch } from "@/hooks";
import Taro from "@tarojs/taro";
import {
  getLocalToken,
  getLocalUid,
  getLocalUserType,
  removeLocalToken,
  removeLocalUid,
  removeLocalUserType,
} from "./local";
import { combineURL } from "./url";

interface IProps {
  url: string; // 接口地址
  filePath: string; // 图片文件
  name: string;
  formData?: any; // 其他参数
  callback?: (params?: any) => any;
}

const ERR_OK = "000000"; // 请求成功
const ERR_TOKEN = "000403"; // token失效或者丢失 需要重新登录
const ERR_FAILED = "999997"; // 请求错误

export const uploadFile = async ({
  url,
  filePath,
  name,
  formData,
  callback,
}: IProps) => {
  const token = getLocalToken();
  const user_type = getLocalUserType();
  const uid = getLocalUid();

  let _header = {
    "Content-Type": "text/html;charset=UTF-8",
    // "content-type": "application/json;charset=UTF-8"
  };

  let _formData = {};

  if (token) {
    // @ts-ignore
    _header["Authorization"] = token;
  }
  if (user_type) {
    // @ts-ignore
    _formData["user_type"] = user_type;
  }
  if (uid) {
    // @ts-ignore
    _formData["uid"] = uid;
  }
  let _url = url;
  if (_url.indexOf("http") === -1) {
    _url = combineURL(baseURL, url);
  }

  Taro.uploadFile({
    url: _url,
    filePath: filePath,
    name: name,
    formData: {
      ..._formData,
      ...formData,
    },
    header: _header,
    success: function (res) {
      Taro.hideLoading();
      const data = JSON.parse(res.data);
      const { code, message, result } = data;

      if (code === ERR_TOKEN) {
        Toast.fail("登录信息失效");
        Taro.redirectTo({
          url: "/pages/hold/index",
        });
        const token = getLocalToken();
        const user_type = getLocalUserType();
        const uid = getLocalUid();

        if (token) removeLocalToken();
        if (user_type) removeLocalUserType();
        if (uid) removeLocalUid();

        const dispatch = useStoreDispatch();
        dispatch({
          type: "global/setUserType",
          payload: "0",
        });
      }

      if (code === ERR_OK) {
        callback && callback(result);
        return;
      }
      if (code === ERR_FAILED) {
        Toast.fail(message);
        return;
      }

      Taro.hideLoading();
      Toast.fail(message);
      //do something
    },
  });
};
