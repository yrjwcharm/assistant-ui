import Taro from "@tarojs/taro";

// token
export function getLocalToken(): string | null {
  let token = null;
  try {
    token = Taro.getStorageSync("token");
  } catch (e) {
    // saving error
  }
  return token;
}

export  function setLocalToken(token: string) {
  try {
     Taro.setStorageSync("token",token);

  } catch (e) {
    // saving error
  }
}

export async function removeLocalToken() {
  try {
    await Taro.removeStorage({ key: "token" });
  } catch (e) {
    // remove error
  }
}

// userType: 用户状态 0: 未登录; 1: 信息授权登录; 2: 手机号授权登录(此时已有uid)
export function getLocalUserType(): string | null {
  let userType = null;
  try {
    userType = Taro.getStorageSync("userType");
  } catch (e) {
    // saving error
  }
  return userType;
}

export async function setLocalUserType(userType: string) {
  try {
    await Taro.setStorage({ key: "userType", data: userType });
  } catch (e) {
    // saving error
  }
}

export async function removeLocalUserType() {
  try {
    await Taro.removeStorage({ key: "userType" });
  } catch (e) {
    // remove error
  }
}

// uid
export function getLocalUid(): string | null {
  let uid = null;
  try {
    uid = Taro.getStorageSync("uid");
  } catch (e) {
    // saving error
  }
  return uid;
}

export async function setLocalUid(uid: string) {
  try {
    await Taro.setStorage({ key: "uid", data: uid });
  } catch (e) {
    // saving error
  }
}

export async function removeLocalUid() {
  try {
    await Taro.removeStorage({ key: "uid" });
  } catch (e) {
    // remove error
  }
}

export function getStorage(key: string): string | null {
  let storage = null;
  try {
    storage = Taro.getStorageSync(key);
  } catch (e) {
    // saving error
  }
  return storage;
}

export async function setStorage(key: string, value: string | number) {
  try {
    await Taro.setStorage({ key, data: value });
  } catch (e) {
    // saving error
  }
}

export async function removeStorage(key: string) {
  try {
    await Taro.removeStorage({ key });
  } catch (e) {
    // remove error
  }
}
