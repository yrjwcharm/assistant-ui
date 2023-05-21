/*
 * @Date: 2023-02-06 10:36:00
 * @LastEditors: lizhengfeng lizhengfeng@licaimofang.com
 * @LastEditTime: 2023-02-08 11:21:04
 * @FilePath: /assistant-ui/src/utils/getUserInfo.ts
 * @Description:
 */
import request from "@/utils/request";
// import { useStoreDispatch } from "@/hooks";
import store from "@/config/dva";

function getInfo() {
  return request(`/assistant/user/info`, {
    method: "GET",
  });
}

// const dispatch = useStoreDispatch();

export const getUserInfo = async () => {
  try {
    const res = await getInfo();
    store.dispatch({
      type: "global/setUserInfo",
      payload: res,
    });
  } catch (error) {}
};
export const updateType = (type: string) => {
  store.dispatch({
    type: "global/setType",
    payload: type,
  });
};
