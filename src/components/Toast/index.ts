import Taro from "@tarojs/taro";

const info = (title: string, duration?: number) => {
  setTimeout(() => {
    Taro.showToast({ title, icon: "none", duration: duration || 1500 });
  }, 0);
};
const success = (title: string, duration?: number) => {
  setTimeout(() => {
    Taro.showToast({ title, icon: "success", duration: duration || 1500 });
  }, 0);
};
const fail = (title: string, duration?: number) => {
  setTimeout(() => {
    Taro.showToast({ title, icon: "none", duration: duration || 1500 });
  }, 0);
};

export const Toast: {
  info: (title: string, duration?: number) => any;
  fail: (title: string, duration?: number) => any;
  success: (title: string, duration?: number) => any;
} = {
  info,
  fail,
  success
};
