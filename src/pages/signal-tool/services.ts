import request from "@/utils/request";

export function getContent(params: { rights_id: string }) {
  return request("/assistant/user/rights/intro", {
    method: "GET",
    params
  });
}
