import request from "@/utils/request";

export function phoneLogin(data: {
  code: string;
  encryptedData: string;
  iv: string;
}) {
  return request("/assistant/user/mini/phoneLogin", {
    method: "POST",
    data
  });
}
