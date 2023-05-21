import request from "@/utils/request";

export function beforeSchedule(params: { activity_id: string | number }) {
  return request("/assistant/user/activity/pk/beforeSchedule", {
    method: "GET",
    params
  });
}
