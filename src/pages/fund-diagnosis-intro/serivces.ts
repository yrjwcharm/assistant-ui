
// 获取关于魔方说明图片
import request from "@/utils/request";

export function callIntroInfo() {
  return request("assistant/diagnose/fund/intro", {
    method: "GET"
  });
}
