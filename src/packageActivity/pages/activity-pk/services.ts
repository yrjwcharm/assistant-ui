import request from "@/utils/request";

// 获取几分钟前报名用户
export function defaultUser() {
  return request("/assistant/user/activity/defaultUser", {
    method: "GET",
    params: {
      scene_type: "pkActivity"
    }
  });
}

// 获取页面信息
export function pageDetail() {
  return request("/assistant/user/activity/detail", {
    method: "GET",
    params: {
      scene_type: "pkActivity"
    }
  });
}
