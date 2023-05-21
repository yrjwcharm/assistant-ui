import request from "@/utils/request";

export function  callRecommendFundApi(){
  return request(`/assistant/invest/plan/recommend/fund`,{
    method:'GET'
  })
}
