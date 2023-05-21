import request from "@/utils/request";

// 报名
export function registration(data: {
  activity_id: string | number;
  schedule_id: string | number;
}) {
  return request("/assistant/user/activity/registration", {
    method: "POST",
    data
  });
}
