// 查询
import request from "@/utils/request";

export function searchFund(data: { brand: string; model: string; platform: string; system: string; user_type: string; words: string; }) {
  return request("/assistant/fundManage/searchFund", {
    method: "POST",
    data
  });
}

export const  callSearchFundNewApi=(data: { words: string; })=>{
  return request(`/assistant/fundManage/searchFundNew`,{
    method:'POST',
    data
  })
}
