import { getStorage } from "@/utils/local";
import request from "@/utils/request";

export function phoneLogin(data: {
  code: string;
  encryptedData: string;
  iv: string;
}) {
  const _initQuery_str = getStorage("initQuery");
  return request("/assistant/user/mini/phoneLogin", {
    method: "POST",
    data: {
      ad_info: _initQuery_str || null,
      ...data,
    },
  });
}
