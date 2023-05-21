import request from "@/utils/request";

export function ruleImages(params: { activity_id: string }) {
  return request("/assistant/user/activity/rule", {
    method: "GET",
    params
  });
}
