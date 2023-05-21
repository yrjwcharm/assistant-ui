import request from "@/utils/request";

export function getFundSnapshot(data: {
  activity_id: string | number;
  schedule_id: string | number;
}) {
  return request("/assistant/user/activity/getFundSnapshot", {
    method: "POST",
    data
  });
}
