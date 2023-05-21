import request from "@/utils/request";

// 获取上传基金的列表
export function callActivityHomeApi() {
  return request("/assistant/annual/index", {
    method: "GET"
  });
}
export function callGetFinanceTransportationSignApi(){
  return request('/assistant/annual/activity/calculate',{
    method:'GET'
  })
}
export function callDownloadImgApi(){
  return request(`/assistant/annual/activity/download`,{
    method:'GET'
  })
}
export function callExitCircleApi(){
  return request(`/assistant/annual/activity/exit`,{
    method:'GET'
  })
}
export function callIsShowMaskPopApi(){
  return request(`/assistant/annual/activity/check`,{
    method:'GET'
  })
}
