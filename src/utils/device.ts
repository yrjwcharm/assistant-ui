import Taro from "@tarojs/taro";
export function isMaxScreen() {
  const { screenWidth: width, screenHeight: height } = getDevicesSize();
  return height / width > 1.8;
}

export const getDevicesSize = () => {
  return Taro.getSystemInfoSync();
};
export const { screenWidth: viewportWidth, screenHeight: viewportHeight } =
  getDevicesSize();

// 根据百分比获取宽度
export const wp = (percentage: number) => {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
};

// 根据百分比获取高度
export const hp = (percentage: number) => {
  const value = (percentage * viewportHeight) / 100;
  return Math.round(value);
};
// 是否是x系列的屏幕
export const isIPhoneX = async () => {
  const res = await Taro.getSystemInfo();
  let screenHeight = res.screenHeight;
  // @ts-ignore
  let bottom = res.safeArea.bottom;
  return screenHeight !== bottom;
};
