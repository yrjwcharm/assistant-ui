import request from "@/utils/request";

export function callRankListApi(params:{
  subject_id:string,
}){
  return request(`/assistant/subject/detail?subject_id=${params.subject_id}&type=0`,{
    method:'GET'
  })
}
