import request from "@/utils/request";

export function callMemberRightInterfaceApi() {
  return request("/assistant/member/right/list", {
    method: "GET",
  });
}

export function callBuyPriceApi() {
  return request(`/assistant/user/right/per/day/price`, {
    method: "GET",
  });
}
