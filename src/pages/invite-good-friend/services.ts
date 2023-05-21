
// 获取未登录时页面图片
import request from "@/utils/request";
export function callInviteFriendInfo(uid){
  return request(`/assistant/invite/accept/log?uid=${uid}`,{
    method:'GET',
  })
}

export function callInviteCardInfo(uid){
  return request(`/assistant/invite/accept/get/inviteCard?uid=${uid}`,{
    method:'GET'
  })
}

export function callFreeApi(){
  return request(`/assistant/invite/member/free/get`,{
    method:'POST'
  })
}
